import React, { useEffect, useState } from 'react'
import App from '@/temps/App'
import UpdateModal from '@/temps/modals/UpdateModal'
import { getLocalVersion, LS_VERSION_KEY } from '@/data'
import TableService from '@/service/TableService'
import { appVersion } from '@/defines'

function reformatLegacy215021(when: boolean) {
  if (!when) return

  const list = TableService.listOfTablesInfo

  for (const { id } of list) {
    const table = TableService.getActiveTableData(id)

    for (let i = 0; i < table.length; i++) {
      table[i]!.entity = table[i]?.['tech'] || table[i]!.entity
      delete table[i]?.['tech']
      table[i]!.tableId = id
    }

    TableService.updateActiveTableData(id, table)
  }
}

type TestUpdate = { when: boolean, fn: (when: boolean) => void }[]

const listOfUpdates = [
  {
    when: getLocalVersion() < 215021,
    fn: reformatLegacy215021,
  },
]

const Updates = () => {
  const [isUpdate] = useState(listOfUpdates.some(it => it.when))

  useEffect(() => {
    if (!isUpdate) return

    for (const { when, fn } of listOfUpdates) {
      if (!when) continue
      fn(when)
    }

    localStorage.setItem(LS_VERSION_KEY, String(appVersion.code))

    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }, [])

  return isUpdate ? <UpdateModal/> : <App/>
}

export default Updates