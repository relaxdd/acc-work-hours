import Table from './table/Table'
import Container from './Container'
import { ITableOptions, IWorkTable, IWorkTableRow } from 'types'
import {
  Actions,
  defOptions,
  defTableStore,
  ITableStore,
  TableContext,
  tableReducer,
  wrapPayload,
} from 'context/TableContext'
import { useEffect, useReducer, useState } from 'react'
import TableButtons from './table/TableButtons'
import Filter from './filter/Filter'
import { getAllIds, getTypedKeys } from '@/utils'
import Left from './left/Left'
import DescrModal from './modals/DescrModal'
import TableService from '@/service/TableService'
import useDidUpdateEffect from '@/hooks/useDidUpdateEffect'
import Empty from './empty/Empty'
import SettingModal from './setting/SettingModal'
import CompareData from '@/utils/class/CompareData'
import { appVersion } from '@/defines'
import { getAppSettings } from '@/utils/login'
import HelpModal from '@/temps/modals/HelpModal'
import AddingModal from '@/temps/modals/AddingModal'

type BoundPartsOfStore = Pick<ITableStore, 'initialTable' | 'modifiedTable' | 'selectedRows'>

function getActiveTableInfo(list?: IWorkTable[]) {
  const listOfTables = list || TableService.listOfTablesInfo
  if (!listOfTables.length) return null

  const active = TableService.activeTable
  if (!active) return listOfTables[0]!

  return listOfTables.find(it => it.id === active) || listOfTables[0]!
}

function getBoundPartsOfStore(table: IWorkTableRow[]): BoundPartsOfStore {
  return {
    initialTable: table,
    modifiedTable: table,
    selectedRows: getAllIds(table),
  }
}

function getActiveOptions(id: string | null, def = defOptions) {
  if (appVersion.code < 213023) {
    console.warn('Need reformat legacy options!')
    return def
  }

  let check = false

  const options = id ? (() => {
    check = true
    return TableService.getActiveOptions(id)
  })() ?? def : def

  if (check) {
    return getTypedKeys(def).reduce<Record<string, any>>((list, key) => {
      list[key] = key in options ? options[key] : def[key]
      return list
    }, {}) as ITableOptions
  }

  return options
}

function getInitStore(): ITableStore {
  const list = TableService.listOfTablesInfo

  const active = getActiveTableInfo(list)
  if (!active) return defTableStore

  const table = TableService.getActiveTableData(active.id)
  const options = getActiveOptions(active.id)

  return {
    ...defTableStore,
    activeTable: active && active.id,
    listOfTables: TableService.listOfTablesInfo,
    options, settings: getAppSettings(),
    ...getBoundPartsOfStore(table),
  }
}

/* ====================================== */

function App() {
  const [store, dispatch] = useReducer(tableReducer, getInitStore())
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
  }, [])

  useEffect(() => {
    function handler(e: any) {
      const msg = 'Do you really want to close?';
      (e || window.event).returnValue = msg
      return msg
    }

    if (CompareData.isEquals(store.initialTable, store.modifiedTable))
      window.removeEventListener('beforeunload', handler)
    else
      window.addEventListener('beforeunload', handler)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [store.initialTable, store.modifiedTable])

  useDidUpdateEffect(() => {
    const table = store.activeTable !== null
      ? TableService.getActiveTableData(store.activeTable)
      : []

    dispatch({
      type: Actions.State,
      payload: {
        ...getBoundPartsOfStore(table),
        options: getActiveOptions(store.activeTable!),
      },
    })
  }, [store.activeTable])

  return width >= 768 ? (
    <Container>
      <TableContext.Provider value={[store, dispatch, wrapPayload]}>
        {store.activeTable === null
          ? <Empty/>
          : (<>
            <Filter/>
            <Table/>
            <TableButtons/>
            <DescrModal/>
            <HelpModal/>
            <SettingModal/>

            {store.options.typeOfAdding === 'full' && (
              <AddingModal/>
            )}
          </>)}

        <Left/>
      </TableContext.Provider>
    </Container>
  ) : (
    <div className="container">
      <div style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center' }}>
        <h2>Для отображения этого приложения ширина экрана должна быть больше 767px :(</h2>
      </div>
    </div>
  )
}

export default App
