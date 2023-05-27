export type FieldsEnum = 'start' | 'finish' | 'lang' | 'paid'
export type DTEnum = 'start' | 'finish'
export type LangEnum = 'js' | 'php' | 'wp' | 'react' | 'html'

export interface IWorkTable {
  id: string,
  userId: string | null,
  name: string,
  created: string,
  password: string | null,
}

export interface IWorkTableRow {
  id: string,
  tableId: string,
  start: string,
  finish: string,
  lang: LangEnum,
  isPaid: boolean,
  description: string
}

export type ListOfRate = Record<LangEnum, number>
type BaseDispatch<V extends Object> = <T extends V, K extends keyof T>(key: K, value: T[K]) => void