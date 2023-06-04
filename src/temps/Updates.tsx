import React, { useEffect, useState } from 'react'
import App from '@/temps/App'
import UpdateModal from '@/temps/modals/UpdateModal'
import { getLocalVersion, LS_VERSION_KEY } from '@/data'
import TableService from '@/service/TableService'
import { localStorageKeys } from '@/utils'
import { appVersion } from '@/defines'
import Random from '@/utils/class/Random'
import { ITableRowLegacy, IWorkTableRow } from '@/types'

type ListOfUpdates = { need: boolean, reformat: (need: boolean) => void }[]

/**
 * Удалить все опции таблиц которые не были удалены до фикса
 */
function reformatLegacy215023(need: boolean) {
  if (!need) return

  const match = 'awenn2015_wh_options_'
  const list = TableService.listOfTablesInfo
  const ids = list.map(it => it.id)

  if (!ids.length) return

  localStorageKeys((key) => {
    if (!key.includes(match)) return

    const id = (() => {
      const split = key.split('_')
      return split[split.length - 1]!
    })()

    if (ids.includes(id)) return
    localStorage.removeItem(key)
  })
}

/**
 * Переименовываем table.tech в table.entity и добавить поле order
 */
function reformatLegacy215024(need: boolean) {
  if (!need) return

  const list = TableService.listOfTablesInfo

  if (!list.length) return

  for (const { id } of list) {
    const table = TableService.getActiveTableData(id) as ITableRowLegacy[]
    if (!table.length) continue

    for (let i = 0; i < table.length; i++) {
      table[i]!['entity'] = table[i]?.['tech'] || table[i]!.entity!
      delete table[i]?.['tech']

      if (table[i]?.tableId !== id)
        table[i]!.tableId = id

      table[i]!['order'] = i + 1
    }

    TableService.updateActiveTableData(id, table as IWorkTableRow[])
  }
}

/**
 * Добавляем всем сущностям уникальный id
 */
function reformatLegacy215040(need: boolean) {
  if (!need) return

  const list = TableService.listOfTablesInfo
  if (!list.length) return

  for (const { id } of list) {
    const options = TableService.getActiveOptions(id)
    if (!options || !options.listOfTech.length) continue

    for (const entity of options.listOfTech)
      entity['id'] = entity?.id || Random.uuid(10)

    TableService.updateActiveOptions(id, options)
  }
}

/**
 * Переименовываем table.entity в table.entityId по id entity и поправить tableId
 */
function reformatLegacy216021(need: boolean) {
  if (!need) return

  const list = TableService.listOfTablesInfo
  if (!list.length) return

  for (const { id } of list) {
    const table = TableService.getActiveTableData(id) as ITableRowLegacy[]
    const options = TableService.getActiveOptions(id)

    if (!options || !table.length) return

    for (const row of table) {
      row['entityId'] = row?.entityId || (row.entity && options.listOfTech.length
        ? options.listOfTech.find(({ key }) => key === row.entity)?.id || null
        : null)

      delete row['entity']

      row['tableId'] = id
    }

    TableService.updateActiveTableData(id, table as IWorkTableRow[])
  }
}

const listOfUpdates: ListOfUpdates = [
  {
    need: getLocalVersion() < 215023,
    reformat: reformatLegacy215023,
  },
  {
    need: getLocalVersion() < 215024,
    reformat: reformatLegacy215024,
  },
  {
    need: getLocalVersion() < 215040,
    reformat: reformatLegacy215040,
  },
  {
    need: getLocalVersion() < 216021,
    reformat: reformatLegacy216021,
  },
]

const Updates = () => {
  const [isUpdate] = useState(listOfUpdates.some(it => it.need))

  useEffect(() => {
    if (!isUpdate) return

    for (const { need, reformat } of listOfUpdates) {
      if (!need) continue
      reformat(need)
    }

    localStorage.setItem(LS_VERSION_KEY, String(appVersion.code))

    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }, [])

  return isUpdate ? <UpdateModal/> : <App/>
}

export default Updates