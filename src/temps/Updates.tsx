import React, { useEffect, useState } from 'react'
import App from '@/temps/App'
import UpdateModal from '@/temps/modals/UpdateModal'
import { getLocalVersion, LS_VERSION_KEY } from '@/data'
import TableService from '@/service/TableService'
import { appVersion } from '@/defines'

function reformatLegacy214040() {
  if (getLocalVersion() >= 214040) return

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

const listOfUpdates = [
  {
    when: getLocalVersion() < 214040,
    fn: reformatLegacy214040,
  },
]

const Updates = () => {
  const [isUpdate] = useState(listOfUpdates.some(it => it.when))

  useEffect(() => {
    if (!isUpdate) return

    for (const update of listOfUpdates) {
      if (!update.when) continue
      update.fn()
    }

    localStorage.setItem(LS_VERSION_KEY, String(appVersion.code))

    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }, [])

  return isUpdate ? <UpdateModal/> : <App/>
}

export default Updates