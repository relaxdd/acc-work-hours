export type FieldsEnum = 'start' | 'finish' | 'entity' | 'paid'
export type DTEnum = 'start' | 'finish'

export type IAppSettings = {
  theme: 'dark' | 'light' | 'system',
  password: string,
  isDisabled: boolean
}

export type ITableOptionsEntity = { key: string, text: string, rate: number }

export type ListOfHiddenCol = 'number' | 'entity' | 'description'
export type ITableOptionsHidden = Record<ListOfHiddenCol, boolean>

export type ListOfUsingKeys = 'delete' | 'up' | 'down'
export type ITableOptionsKeys = Record<ListOfUsingKeys, string>

export type ITableOptions = {
  dtRoundStep: number,
  listOfTech: ITableOptionsEntity[]
  hiddenCols: ITableOptionsHidden
  usingKeys: ITableOptionsKeys,
  typeOfAdding: 'fast' | 'full'
}

export interface IWorkTable {
  id: string,
  userId: string | null,
  name: string,
  created: string,
  password: string | null,
  count: number
}

export type IWorkTableRow = {
  id: string,
  tableId: string,
  start: string,
  finish: string,
  entity: string,
  isPaid: boolean,
  description: string,
  order: number
} & { tech?: string }

export type BaseDispatch<V extends Object> = <T extends V, K extends keyof T>(key: K, value: T[K]) => void