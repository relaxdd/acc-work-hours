export type FieldsEnum = 'start' | 'finish' | 'tech' | 'paid'
export type DTEnum = 'start' | 'finish'

export type IAppSettings = {
  theme: 'dark' | 'light' | 'system'
}

export type ITableOptionsTech = { key: string, text: string, rate: number }

export type ListOfHiddenCol =  'number' | 'description'
export type ITableOptionsHidden = Record<ListOfHiddenCol, boolean>

export type ListOfUsingKeys =  'delete' | 'up' | 'down'
export type ITableOptionsKeys= Record<ListOfUsingKeys, string>

export type ITableOptions = {
  dtRoundStep: number,
  listOfTech: ITableOptionsTech[]
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

export interface IWorkTableRow {
  id: string,
  tableId: string,
  start: string,
  finish: string,
  tech: string,
  isPaid: boolean,
  description: string
}

// export type PartOfWorkTable = Pick<IWorkTable, 'id' | 'name' | 'created' | 'count'>
export type ListOfRate = Record<string, number>
export type BaseDispatch<V extends Object> = <T extends V, K extends keyof T>(key: K, value: T[K]) => void