import { ITableOptions, IWorkTable, IWorkTableRow } from '@/types'
import Random from 'utils/class/Random'
import { getFormattedDateTime, parseLocalStorage } from '@/utils'
import { getLsOptionsKey, getLsTableKey, LS_ACTIVE_KEY, LS_TABLES_KEY } from '@/data'

// function checkNumber(n: any, type: 'int' | 'float') {
//   switch (type) {
//     case 'int':
//       return typeof n === 'number' && Number.isInteger(n)
//     case 'float':
//       return typeof n === 'number' && !Number.isInteger(n)
//   }
// }

// type BaseScalarTypes = 'int' | 'float' | 'string' | 'bool' | 'null'
// type ListOfSchemeTypes<T extends Object> = { key: keyof T, type: BaseScalarTypes }[]

class TableService {
  public static set listOfTablesInfo(list: IWorkTable[]) {
    localStorage.setItem(LS_TABLES_KEY, JSON.stringify(list))
  }

  public static get listOfTablesInfo() {
    return parseLocalStorage<IWorkTable[]>(LS_TABLES_KEY)
  }

  public static get activeTable() {
    return localStorage.getItem(LS_ACTIVE_KEY)
  }

  public static set activeTable(id: string | null) {
    if (id === null)
      localStorage.removeItem(LS_ACTIVE_KEY)
    else
      localStorage.setItem(LS_ACTIVE_KEY, id)
  }

  public static getActiveOptions(id: string): ITableOptions | null {
    const json = localStorage.getItem(getLsOptionsKey(id))
    return json ? JSON.parse(json) : null
  }

  public static updateActiveOptions(id: string, options: ITableOptions) {
    localStorage.setItem(getLsOptionsKey(id), JSON.stringify(options))
  }

  /* Methods */

  public static updateActiveTableData(id: string, table: IWorkTableRow[]) {
    localStorage.setItem(getLsTableKey(id), JSON.stringify(table))
  }

  public static getActiveTableData(id: string) {
    return parseLocalStorage<IWorkTableRow[]>(getLsTableKey(id))
  }

  public static createWorkTable(name: string): IWorkTable {
    const id = Random.uuid(12)

    const item: IWorkTable = {
      id, name,
      created: getFormattedDateTime(),
      password: null,
      userId: null,
      count: 0,
    }

    localStorage.setItem(getLsTableKey(id), '[]')
    this.addNewTableInfo(item)

    return item
  }

  public static addNewTableInfo(item: IWorkTable): void {
    const list = this.listOfTablesInfo

    const same = list.find(({ id, name }) => {
      return id === item.id || name === item.name
    })

    if (same) {
      alert('Таблица с таким id или именем уже существует!')
      return
    }

    list.push(item)
    this.listOfTablesInfo = list
  }

  public static deleteWorkTable(id: string): IWorkTable[] | false {
    localStorage.removeItem(getLsTableKey(id))
    localStorage.removeItem(getLsOptionsKey(id))

    const list = this.listOfTablesInfo
    const index = list.findIndex(it => it.id === id)

    if (index === -1) return false

    list.splice(index, 1)
    this.listOfTablesInfo = list

    return list
  }

  public static deleteAllTables() {
    const list = this.listOfTablesInfo
    const ind = Random.int(0, list.length - 1)
    const msg = 'Для подтверждения введите название '
    const check = window.prompt(msg + `${ind + 1}-ой таблицы`)

    if (check !== list[ind]!.name) return

    alert('Not Implemented!')
  }
}

export default TableService