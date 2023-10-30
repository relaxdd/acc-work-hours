// TODO: Поменять типы всех ID на number
// TODO: Добавить предупреждение о том что нельзя удалять сущность пока к ней привязанны какие то строки в таблице

export type FieldsEnum = 'start' | 'finish' | 'entity' | 'paid'
export type DTEnum = 'start' | 'finish'

export type IAppSettings = {
  theme: 'dark' | 'light' | 'system',
  password: string,
  isDisabled: boolean
}

export type ITableOptionsEntity = {
  id: number,
  key: string,
  text: string,
  rate: number,
  tableId: number, 
  optionId: number
}

export type ListOfHiddenCol = 'number' | 'entity' | 'description'
export type ITableOptionsHidden = Record<ListOfHiddenCol, boolean>

export type ListOfUsingKeys = 'delete' | 'up' | 'down'
export type ITableOptionsKeys = Record<ListOfUsingKeys, string>

export type ITableFullData = {
  rows: IWorkTableRow[],
  options: ITableOptions,
}

export type ITableOptions = {
  id: number,
  dtRoundStep: number,
  listOfTech: ITableOptionsEntity[]
  hiddenCols: ITableOptionsHidden
  usingKeys: ITableOptionsKeys,
  typeOfAdding: 'fast' | 'full',
  tableId: number
}

export interface IWorkTable {
  id: number,
  name: string,
  password: string | null,
  count: number
  created: string,
  userId: number,
}

export type IWorkTableRow = {
  id: number,
  start: string,
  finish: string,
  isPaid: boolean,
  description: string,
  order: number,
  tableId: number,
  entityId: number,
}

export type ITableRowLegacy = Omit<IWorkTableRow, 'entityId'> & {
  tech?: string,
  entity?: string,
  entityId?: string | null
}

export type BaseDispatch<V extends Object> = <T extends V, K extends keyof T>(key: K, value: T[K]) => void