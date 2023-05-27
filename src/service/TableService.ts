import { IWorkTable, IWorkTableRow } from 'types'
import Random from 'utils/class/Random'
import { getFormattedDateTime, parseLocalStorage } from 'utils'
import { getLsTableKey, LS_ACTIVE_KEY, LS_TABLES_KEY } from '../data'
import { PartOfWorkTable } from '../context/TableContext'

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

  /* Methods */

  public static updateActiveTableData(id: string, table: IWorkTableRow[]) {
    localStorage.setItem(getLsTableKey(id), JSON.stringify(table))
  }

  public static getActiveTableData(id: string) {
    return parseLocalStorage<IWorkTableRow[]>(getLsTableKey(id))
  }

  public static createWorkTable(name: string): string {
    const id = Random.uuid(12)

    const item: IWorkTable = {
      id, name,
      created: getFormattedDateTime(),
      password: null,
      userId: null,
    }

    localStorage.setItem(getLsTableKey(id), '[]')
    this.addNewTableInfo(item)

    return id
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

  public static deleteWorkTable(id: string): PartOfWorkTable[] | false {
    localStorage.removeItem(getLsTableKey(id))

    const list = this.listOfTablesInfo
    const index = list.findIndex(it => it.id === id)

    if (index === -1)
      return false

    list.splice(index, 1)
    this.listOfTablesInfo = list

    return list.map(({ id, name }) => ({ id, name }))
  }

  public static deleteAllTables() {
    const list = this.listOfTablesInfo
    const ind = Random.int(0, list.length - 1)
    const msg = 'Для подтверждения введите название '
    const check = window.prompt(msg + `${ind + 1}-ой таблицы`)

    if (check !== list[ind]!.name) return
    console.log(check)
  }
}

export default TableService