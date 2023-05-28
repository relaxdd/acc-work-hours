import { IWorkTableRow, ListOfRate } from '@/types'
import Random from './class/Random'

export function getDiffOfHours(start: string, finish: string): number {
  const date1 = new Date(start)
  const date2 = new Date(finish)

  const oneDay = 1000 * 60 * 60
  const diffInTime = date2.getTime() - date1.getTime()

  return roundNumber(diffInTime / oneDay, 2)
}

export function formatDate(obj: IWorkTableRow): string {
  const { start, finish } = obj

  const getDate = (dt: string) => dt.split('T')[0]!

  const format = (date: string) => {
    return date.replaceAll('-', '.').split('.').reverse().join('.')
  }

  const d1 = getDate(start)
  const d2 = getDate(finish)

  return d1 === d2 ? format(d1) : `${format(d1)} — ${format(d2)}`
}

export function getTimeByDT(datetime: string) {
  return datetime.split('T').at(1)
}

export function getTypedKeys<T extends Object>(obj: T) {
  return Object.keys(obj) as (keyof T)[]
}

export function getDateTimeWithOffset(hours: number = 1, iso?: string) {
  const d = new Date(iso || Date.now())
  d.setHours(d.getHours() + hours)

  return getFormattedDateTime(d)
}

export function getFormattedDateTime(dt?: number | Date) {
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dt).replace(' ', 'T')
}

export function roundNumber(a: number, q: number = 2) {
  return Math.round(a * 10 ** q) / 10 ** q
}

export function ceilHours(h: number) {
  return Math.ceil(h * 100) / 100
}

export const getHoursOrZero = (qty: number) => isNaN(qty) ? 0 : ceilHours(qty)

// export function getListOfRate() {
//   const json = localStorage.getItem('_awenn2015_wh_rates')
//
//   if (json === null) return defListOfRate
//   else {
//     return getTypedKeys(defListOfRate).reduce((data, key) => {
//       const list = JSON.parse(json) as ListOfRate
//       data[key] = list?.[key] || defListOfRate[key]
//
//       return data
//     }, {} as ListOfRate)
//   }
// }

export function roundDateTime(datetime: string, step: number) {
  type Result = { minutes: string, isIncrease: boolean }

  const minutes = +datetime.split('T').at(-1)!.split(':').at(-1)!
  if (minutes % step === 0) return datetime

  const steps = Math.floor(minutes / step)
  const clear = minutes - (steps * step)
  const direction = clear > step / 2

  const addLeadZero = (m: number) => String(m).padStart(2, '0')

  const getValueWithLeadZero = (m: number): Result => {
    return { minutes: addLeadZero(m), isIncrease: false }
  }

  const info = !direction
    ? getValueWithLeadZero(steps * step)
    : ((): Result => {
      const result = (steps + 1) * step

      return result === 60
        ? { minutes: '00', isIncrease: true }
        : getValueWithLeadZero(result)
    })()

  // withOffset.substring(0, withOffset.length - 2)
  const withOffset = getDateTimeWithOffset(+info.isIncrease, datetime)

  return `${withOffset.split(':')[0]}:${info.minutes}`
}

export function formatLegacy(table: IWorkTableRow[]) {
  return table.map((it) => {
    return {
      ...it,
      id: it?.id || Random.uuid(),
      description: it?.description || '',
    }
  }) as IWorkTableRow[]
}

export function parseLocalStorage<T = any>(key: string, def = '[]') {
  try {
    return JSON.parse(localStorage.getItem(key) ?? def) as T
  } catch (e) {
    return JSON.parse(def) as T
  }
}

export function getAllIds<T extends { id: string }>(data: T[]): string[] {
  return data.map(it => it.id)
}

export function round(n1: number, n2 = 2) {
  return Math.round(n1 * 10 ** n2) / 10 ** n2
}

export function calcRatioOfArrayValues(arr: string[]) {
  type ListOfItemRatio = Record<string, { count: number, percent: number }>

  return arr.reduce<ListOfItemRatio>((acc, it) => {
    acc[it] = !(it in acc)
      ? { count: 1, percent: round(1 / arr.length) }
      : (() => {
        const count = acc[it]!.count + 1
        return { count, percent: round(count / arr.length) }
      })()

    return acc
  }, {})
}

export function localStorageKeys(fn: (key: string) => void) {
  for (let i = 0; i < localStorage.length; i++)
    fn(localStorage.key(i)!)
}

// export function getTableInfoDto({ id, name, created, count }: IWorkTable): PartOfWorkTable {
//   return { id, name, created, count }
// }
//
// export function getTablesInfoDto(list: IWorkTable[]): PartOfWorkTable[] {
//   return list.map(getTableInfoDto)
// }