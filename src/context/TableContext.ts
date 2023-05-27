import { DTEnum, IWorkTable, IWorkTableRow, LangEnum, ListOfRate } from '../types'
import { createContext, Dispatch, useContext } from 'react'
import { defListOfRate } from '../data'

export type DispatchTableData<T extends Object> = (key: keyof T, value: T[keyof T], index: number) => void
export type ChangeDateTime = (type: DTEnum, value: string, id: string) => void

type DispatchRewrite<T extends Object, K extends keyof T = keyof T> = { key: K, value: T[K] }
type RewriteDispatch2 = <T extends ITableStore, K extends keyof T>(key: K, value: T[K]) => DispatchRewrite<T>

export enum Actions {
  WH_Item = 'workHoursItem',
  Rewrite = 'rewrite',
  Filter = 'filter',
  State = 'state'
}

export type ITableFilter = {
  lang: LangEnum | 'none',
  date: string
}

export type ITableOptions = {
  dtRoundStep: number
}

export type IModalVisible = {
  visible: boolean,
  id: string | null
}

type DispatchTable =
  ({ key: 'id' | 'start' | 'finish' | 'description', value: string }
    | { key: 'lang', value: LangEnum }
    | { key: 'isPaid', value: boolean }) & { id: string }

//type DispatchRewrite =
//  | { key: 'selected', value: string[] }
//  | { key: 'workHours', value: IWorkTableRow[] }
//  | { key: 'filteredWH', value: IWorkTableRow[] }
//  | { key: 'filter', value: ITableFilter }
//  | { key: 'options', value: ITableOptions }
//  | { key: 'leftVisible', value: boolean }
//  | { key: 'modalVisible', value: IModalVisible }

type DispatchFilter =
  | { key: 'lang', value: LangEnum }
  | { key: 'date', value: string }

export type ActionOfTReducer =
  | { type: Actions.WH_Item, payload: DispatchTable }
  | { type: Actions.Rewrite, payload: DispatchRewrite<ITableStore> }
  | { type: Actions.Filter, payload: DispatchFilter }
  | { type: Actions.State, payload: Partial<ITableStore> }

export type PartOfWorkTable = Pick<IWorkTable, 'id' | 'name'>

export type ITableStore = {
  /** Некоторые данные описания таблиц для отрисовки в левом меню */
  listOfTables: PartOfWorkTable[]
  /** Активная рабочая таблица */
  activeTable: string | null
  /** Отображение списка таблиц */
  leftVisible: boolean,
  /** Отображение модалки с настройками */
  settingVisible: boolean,
  /** Отображение модального окна с редактированием описания */
  modalVisible: IModalVisible,
  /** Текущая таблица без правок */
  initialTable: IWorkTableRow[],
  /** Все данные таблицы */
  modifiedTable: IWorkTableRow[],
  /** Отфильтрованные данные таблицы */
  filteredTable: IWorkTableRow[],
  /** Список из выбранных для подсчета id */
  selectedRows: string[],
  /** Ставка в час для каждого стека */
  listOfRate: ListOfRate,
  /** Состояние фильтра таблицы */
  filter: ITableFilter,
  /** Состояние опций таблицы */
  options: ITableOptions
}

type ITableContext = [ITableStore, Dispatch<ActionOfTReducer>, RewriteDispatch2]

export const defTableFilter: ITableFilter = {
  lang: 'none',
  date: 'none',
}

export const defModalVisible: IModalVisible = {
  id: null,
  visible: false,
}

export const defTableContext: ITableStore = {
  listOfTables: [],
  activeTable: null,
  settingVisible: false,
  leftVisible: false,
  initialTable: [],
  modifiedTable: [],
  filteredTable: [],
  selectedRows: [],
  modalVisible: defModalVisible,
  listOfRate: defListOfRate,
  filter: defTableFilter,
  options: {
    dtRoundStep: 15,
  },
}

export const wrapPayload: RewriteDispatch2 = (key, value) => {
  return { key, value }
}

function dispatchWorkHours(prev: IWorkTableRow[], { id, key, value }: DispatchTable): IWorkTableRow[] {
  return prev.map((it) => {
    return it.id !== id ? it : { ...it, [key]: value }
  })
}

export function tableReducer(state: ITableStore, action: ActionOfTReducer): ITableStore {
  switch (action.type) {
    case Actions.State:
      return { ...state, ...action.payload }
    case Actions.Rewrite:
      return { ...state, [action.payload.key]: action.payload.value }
    case Actions.WH_Item: {
      return {
        ...state,
        modifiedTable: dispatchWorkHours(state.modifiedTable, action.payload),
      }
    }
    case Actions.Filter: {
      return {
        ...state, filter: {
          ...state.filter,
          [action.payload.key]: action.payload.value,
        },
      }
    }
  }
}

export const TableContext = createContext<ITableContext>([defTableContext, () => ({}), wrapPayload])

export const useTableContext = () => useContext(TableContext)