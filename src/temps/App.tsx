import Table from './table/Table'
import Wrapper from './Wrapper'
import { IWorkTable, IWorkTableRow } from 'types'
import {
  Actions,
  defTableContext,
  ITableOptions,
  ITableStore,
  TableContext,
  tableReducer,
  wrapPayload,
} from 'context/TableContext'
import { LS_OPTION_KEY } from 'data'
import { useReducer } from 'react'
import TableButtons from './table/TableButtons'
import Filter from './filter/Filter'
import { getAllIds, getListOfRate, getTablesInfoDto } from 'utils'
import Left from './left/Left'
import DescriptionModal from './DescriptionModal'
import TableService from 'service/TableService'
import useDidUpdateEffect from '../hooks/useDidUpdateEffect'
import Empty from './Empty'
import SettingModal from './setting/SettingModal'

function getLocalOptions() {
  const options = localStorage.getItem(LS_OPTION_KEY)
  if (!options) return null
  // TODO: Добавить проверку каждой опции
  return JSON.parse(options) as ITableOptions
}

function getActiveTableInfo(list?: IWorkTable[]) {
  const listOfTables = list || TableService.listOfTablesInfo
  if (!listOfTables.length) return null

  const active = TableService.activeTable
  if (!active) return listOfTables[0]!

  return listOfTables.find(it => it.id === active) || listOfTables[0]!
}

type BoundedPartsOfStore = Pick<ITableStore, 'initialTable' | 'modifiedTable' | 'selectedRows'>

function getBoundedPartsOfStore(table: IWorkTableRow[]): BoundedPartsOfStore {
  return {
    initialTable: table,
    modifiedTable: table,
    selectedRows: getAllIds(table),
  }
}

function getInitStore(): ITableStore {
  const list = TableService.listOfTablesInfo

  const active = getActiveTableInfo(list)
  if (!active) return defTableContext

  const table = TableService.getActiveTableData(active.id)

  const listOfRate = getListOfRate()
  const options = getLocalOptions() ?? defTableContext.options

  return {
    ...defTableContext,
    activeTable: active && active.id,
    listOfTables: getTablesInfoDto(list),
    listOfRate, options,
    ...getBoundedPartsOfStore(table),
  }
}

/* ====================================== */

function App() {
  const [store, dispatch] = useReducer(tableReducer, getInitStore())

  useDidUpdateEffect(() => {
    const table = store.activeTable !== null
      ? TableService.getActiveTableData(store.activeTable)
      : []

    dispatch({
      type: Actions.State,
      payload: getBoundedPartsOfStore(table),
    })
  }, [store.activeTable])

  return (
    <Wrapper>
      <TableContext.Provider value={[store, dispatch, wrapPayload]}>
        {store.activeTable === null
          ? <Empty/>
          : (<>
            <Filter/>
            <Table/>
            <TableButtons/>
            <DescriptionModal/>
          </>)}

        <Left/>
        <SettingModal/>
      </TableContext.Provider>
    </Wrapper>
  )
}

export default App
