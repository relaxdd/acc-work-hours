import React, { useEffect, useState } from 'react'
import App from '@/temps/App'
import UpdateModal from '@/temps/modals/UpdateModal'
import { getLocalVersion, LS_VERSION_KEY } from '@/data'
import TableService from '@/service/TableService'
import { localStorageKeys } from '@/utils'
import { appVersion } from '@/defines'

type ListOfUpdates = { need: boolean, reformat: (need: boolean) => void }[]


function reformatLegacy215023(when: boolean) {
  if (!when) return

  const match = 'awenn2015_wh_options_'
  const list = TableService.listOfTablesInfo
  const ids = list.map(it => it.id)

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

function reformatLegacy215024(when: boolean) {
  if (!when) return

  const list = TableService.listOfTablesInfo

  for (const { id } of list) {
    const table = TableService.getActiveTableData(id)
    if (!table.length) continue

    for (let i = 0; i < table.length; i++) {
      table[i]!['entity'] = table[i]?.['tech'] || table[i]!.entity
      delete table[i]?.['tech']

      if (table[i]?.tableId !== id)
        table[i]!.tableId = id

      table[i]!['order'] = i + 1
    }

    TableService.updateActiveTableData(id, table)
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