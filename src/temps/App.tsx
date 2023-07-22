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
import { useEffect, useReducer, useRef, useState } from 'react'
import Bottom from './Bottom'
import Filter from './filter/Filter'
import { getAllIds, getTypedKeys } from '@/utils'
import Left from './left/Left'
import DescrModal from './modals/DescrModal'
import TableService from '@/service/TableService'
import useDidUpdateEffect from '@/hooks/useDidUpdateEffect'
import Empty from './empty/Empty'
import SettingModal from './setting/SettingModal'
import CompareData from '@/utils/class/CompareData'
import { getAppSettings } from '@/utils/login'
import HelpModal from '@/temps/modals/HelpModal'
import AddingModal from '@/temps/modals/AddingModal'
import TableServer from '@/service/TableServer'
import { Spinner } from 'react-bootstrap'

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

function qtyObjKeys(obj: Object): number {
  return Object.keys(obj).length
}

function validateOptions(opt: ITableOptions, def: ITableOptions) {
  const verify = ['hiddenCols', 'usingKeys']

  return getTypedKeys(def).reduce<Record<string, any>>((list, key) => {
    if (!(key in opt))
      list[key] = def[key]
    else if (verify.includes(key))
      list[key] = qtyObjKeys(opt[key]) === qtyObjKeys(def[key])
        ? opt[key] : def[key]
    else if (key === 'listOfTech')
      list[key] = opt[key].length ? opt[key] : def[key]
    else
      list[key] = opt[key]

    return list
  }, {}) as ITableOptions
}

function getActiveOptions(id: string | null, def = defOptions) {
  let validate = false

  const options = id ? (() => {
    validate = true
    return TableService.getActiveOptions(id)
  })() ?? def : def

  if (validate)
    return validateOptions(options, def)
  else
    return options
}

async function getServerStore(): Promise<ITableStore> {
  const list = await TableServer.getTables()

  const active = getActiveTableInfo(list)
  if (!active) return defTableStore

  const { rows, options } = await TableServer.getAllData(active.id)

  return {
    ...defTableStore,
    activeTable: active && active.id,
    listOfTables: list, options,
    settings: getAppSettings(),
    ...getBoundPartsOfStore(rows),
  }
}

/* ====================================== */

function App() {
  const [store, dispatch] = useReducer(tableReducer, defTableStore)
  const [width, setWidth] = useState(window.innerWidth)
  const [isLoading, setLoading] = useState(true)
  const isInit = useRef(true)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })

    getServerStore().then(data => {
      dispatch({
        type: Actions.State,
        payload: data
      })

      setLoading(false)
      isInit.current = false
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

  useDidUpdateEffect(async () => {
    if (isInit.current) return

    const table = store.activeTable !== null
      ? await TableServer.getRows(store.activeTable)
      : []

    console.log(table)

    dispatch({
      type: Actions.State,
      payload: {
        ...getBoundPartsOfStore(table),
        options: getActiveOptions(store.activeTable!),
      },
    })
  }, [store.activeTable])

  return width >= 768 ? (
    <TableContext.Provider value={[store, dispatch, wrapPayload]}>
      {isLoading
        ? (
          <div
            style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Spinner variant={'primary'}/>
          </div>
        )
        : (
          <Container>
            {store.activeTable === null
              ? <Empty/>
              : (<>
                <Filter/>
                <Table/>
                <Bottom/>
                <DescrModal/>
                <HelpModal/>
                <SettingModal/>

                {store.options.typeOfAdding === 'full' && (
                  <AddingModal/>
                )}
              </>)}

            <Left/>
          </Container>
        )}
    </TableContext.Provider>
  ) : (
    <div className="container">
      <div style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center' }}>
        <h2>Для отображения этого приложения ширина экрана должна быть больше 767px :(</h2>
      </div>
    </div>
  )
}

export default App
