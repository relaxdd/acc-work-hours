import { DTEnum, IWorkData, LangEnum, ListOfRate } from '../types'
import { createContext, Dispatch, useContext } from 'react'
import { defListOfRate } from '../data'

export type DispatchTableData<T extends Object> = (key: keyof T, value: T[keyof T], index: number) => void
export type ChangeDateTime = (type: DTEnum, value: string, id: string) => void

export enum Actions {
  WH_Item = 'workHoursItem',
  Rewrite = 'rewrite',
  Filter = 'filter'
}

export type ITableFilter = {
  lang: LangEnum | 'none',
  date: string
}

export type ITableOptions = {
  dtRoundStep: number
}

type DispatchWorkHours =
  ({ key: 'id' | 'start' | 'finish', value: string }
    | { key: 'lang', value: LangEnum }
    | { key: 'isPaid', value: boolean }) & { id: string }

type DispatchRewrite =
  | { key: 'selected', value: string[] }
  | { key: 'workHours', value: IWorkData[] }
  | { key: 'filteredWH', value: IWorkData[] }
  | { key: 'filter', value: ITableFilter }
  | { key: 'options', value: ITableOptions }

type DispatchFilter =
  | { key: 'lang', value: LangEnum }
  | { key: 'date', value: string }

export type ActionOfTReducer =
  | { type: Actions.WH_Item, payload: DispatchWorkHours }
  | { type: Actions.Rewrite, payload: DispatchRewrite }
  | { type: Actions.Filter, payload: DispatchFilter }

export type ITableStore = {
  workHours: IWorkData[],
  filteredWH: IWorkData[],
  selected: string[],
  listOfRate: ListOfRate,
  filter: ITableFilter,
  options: ITableOptions
}

type ITableContext = [ITableStore, Dispatch<ActionOfTReducer>]

export const defTableFilter: ITableFilter = {
  lang: 'none',
  date: 'none',
}

export const defTableContext: ITableStore = {
  workHours: [],
  filteredWH: [],
  selected: [],
  listOfRate: defListOfRate,
  filter: defTableFilter,
  options: {
    dtRoundStep: 15,
  },
}

function dispatchWorkHours(prev: IWorkData[], { id, key, value }: DispatchWorkHours): IWorkData[] {
  return prev.map((it) => {
    return it.id !== id ? it : { ...it, [key]: value }
  })
}

export function tableReducer(state: ITableStore, action: ActionOfTReducer): ITableStore {
  switch (action.type) {
    case Actions.Rewrite: {
      return { ...state, [action.payload.key]: action.payload.value }
    }
    case Actions.WH_Item: {
      return {
        ...state,
        workHours: dispatchWorkHours(state.workHours, action.payload),
      }
    }
    case Actions.Filter: {
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.key]: action.payload.value,
        },
      }
    }
  }
}

export const TableContext = createContext<ITableContext>([defTableContext, () => ({})])
export const useTableContext = () => useContext(TableContext)