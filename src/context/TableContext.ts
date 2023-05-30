import { createContext, Dispatch, useContext } from 'react'
import { DTEnum, IAppSettings, ITableOptions, IWorkTable, IWorkTableRow } from '@/types'
import { defAppSetting } from '@/utils/login'

type DispatchRewrite<T extends Object, K extends keyof T = keyof T> = { key: K, value: T[K] }
type RewriteDispatch2 = <T extends ITableStore, K extends keyof T>(key: K, value: T[K]) => DispatchRewrite<T>
type ListOfVisibility = 'left' | 'setting' | 'help' | 'adding'

// export type DispatchTableData<T extends Object> = (key: keyof T, value: T[keyof T], index: number) => void
export type ChangeDateTime = (type: DTEnum, value: string, id: string) => void

export enum Actions {
  WH_Item,
  Rewrite,
  Visible,
  Filter,
  State,
}

export type ITableFilter = {
  entity: string | 'none',
  date: string
}

export type IModalVisible = {
  visible: boolean,
  id: string | null
}

type DispatchTable =
  ({ key: 'id' | 'start' | 'finish' | 'description', value: string }
    | { key: 'entity', value: string }
    | { key: 'isPaid', value: boolean }) & { id: string }

type DispatchFilter =
  | { key: 'entity', value: string }
  | { key: 'date', value: string }

export type ActionOfTReducer =
  | { type: Actions.WH_Item, payload: DispatchTable }
  | { type: Actions.Rewrite, payload: DispatchRewrite<ITableStore> }
  | { type: Actions.Filter, payload: DispatchFilter }
  | { type: Actions.State, payload: Partial<ITableStore> }
  | { type: Actions.Visible, payload: { key: ListOfVisibility, value: boolean } }


export type ITableStore = {
  visibility: Record<ListOfVisibility, boolean>,
  /** Некоторые данные описания таблиц для отрисовки в левом меню */
  listOfTables: IWorkTable[]
  /** Активная рабочая таблица */
  activeTable: string | null
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
  /** Состояние фильтра таблицы */
  filter: ITableFilter,
  /** Состояние опций таблицы */
  options: ITableOptions,
  /** Настройки приложения */
  settings: IAppSettings
}

type ITableContext = [ITableStore, Dispatch<ActionOfTReducer>, RewriteDispatch2]

export const defTableFilter: ITableFilter = {
  entity: 'none',
  date: 'none',
}

export const defModalVisible: IModalVisible = {
  id: null,
  visible: false,
}

export const defVisibility: Record<ListOfVisibility, boolean> = {
  left: false,
  setting: false,
  help: false,
  adding: false
}

export const defOptions: ITableOptions = {
  dtRoundStep: 10,
  typeOfAdding: 'fast',
  hiddenCols: {
    number: false,
    description: false,
  },
  usingKeys: {
    delete: 'Delete',
    up: 'ArrowUp',
    down: 'ArrowDown',
  },
  listOfTech: [
    { key: 'base', text: 'Базовый', rate: 200 },
  ],
}

export const defTableStore: ITableStore = {
  listOfTables: [],
  activeTable: null,
  initialTable: [],
  modifiedTable: [],
  filteredTable: [],
  selectedRows: [],
  modalVisible: defModalVisible,
  filter: defTableFilter,
  settings: defAppSetting,
  visibility: defVisibility,
  options: defOptions,
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
    case Actions.Visible: {
      return {
        ...state, visibility: {
          ...state.visibility,
          [action.payload.key]: action.payload.value
        }
      }
    }
  }
}

export const TableContext = createContext<ITableContext>([defTableStore, () => ({}), wrapPayload])

export const useTableContext = () => useContext(TableContext)