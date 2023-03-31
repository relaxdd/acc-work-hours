import Table from './table/Table'
import Wrapper from './Wrapper'
import Random from '../utils/class/Random'
import { IWorkData } from '../types'
import { defTableContext, ITableOptions, ITableStore, TableContext, tableReducer } from '../context/TableContext'
import { LS_DATA_KEY, LS_OPTION_KEY } from '../data'
import { useReducer, useState } from 'react'
import TableButtons from './table/TableButtons'
import Filter from './filter/Filter'
import { getListOfRate } from '../utils'
import Left from './left/Left'
import DescriptionModal from './DescriptionModal'

type LegacyWorkData = Omit<IWorkData, 'id' | 'description'> & { id?: string, description?: string }

export const defWorkData: (LegacyWorkData | IWorkData)[] = JSON.parse(localStorage.getItem(LS_DATA_KEY) ?? '[]')

export function formatLegacy() {
  return defWorkData.map((it) => {
    return {
      ...it,
      id: it?.id || Random.uuid(),
      description: it?.description || '',
    }
  }) as IWorkData[]
}

export function getAllIds(data: IWorkData[]): string[] {
  return data.map(it => it.id)
}

function getLocalOptions() {
  const options = localStorage.getItem(LS_OPTION_KEY)
  if (!options) return null
  // TODO: Добавить проверку каждой опции
  return JSON.parse(options) as ITableOptions
}

function getDefStore(): ITableStore {
  const workHours = formatLegacy()
  const selected = getAllIds(workHours)
  const listOfRate = getListOfRate()
  const options = getLocalOptions() ?? defTableContext.options

  return {
    ...defTableContext,
    workHours, selected, listOfRate, options,
  }
}

function App() {
  const reducer = useReducer(tableReducer, getDefStore())

  return (
    <Wrapper>
      <TableContext.Provider value={reducer}>
        <Filter />
        <Table />
        <TableButtons />
        <Left />
        <DescriptionModal />
      </TableContext.Provider>
    </Wrapper>
  )
}

export default App
