export type FieldsEnum = "start" | "finish" | "lang" | "paid"
export type DTEnum = "start" | "finish"
export type LangEnum = "js" | "php" | "wp" | "react" | "html"

export declare interface IWorkData {
  id: string
  start: string,
  finish: string,
  lang: LangEnum,
  isPaid: boolean,
}

export type SomeObject<T = any> = { [key: string]: T } & Object
export type Pair<T> = [T, T]
export type ListOfRate = { [key in LangEnum]: number }