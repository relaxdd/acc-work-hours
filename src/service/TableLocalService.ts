import { IWorkTable } from "@/types";
import { parseLocalStorage } from "@/utils";
import { LS_ACTIVE_KEY, LS_TABLES_KEY } from "@/data";

class TableLocalService {
  public static set listOfTablesInfo(list: IWorkTable[]) {
    localStorage.setItem(LS_TABLES_KEY, JSON.stringify(list));
  }

  public static get listOfTablesInfo() {
    return parseLocalStorage<IWorkTable[]>(LS_TABLES_KEY);
  }

  public static get activeTable() {
    return localStorage.getItem(LS_ACTIVE_KEY);
  }

  public static set activeTable(id: string | null) {
    if (id === null) localStorage.removeItem(LS_ACTIVE_KEY);
    else localStorage.setItem(LS_ACTIVE_KEY, id);
  }

  // public static getActiveOptions(id: string): ITableOptions | null {
  //   const json = localStorage.getItem(getLsOptionsKey(id))
  //   return json ? JSON.parse(json) : null
  // }

  // public static updateActiveOptions(id: string, options: ITableOptions) {
  //   localStorage.setItem(getLsOptionsKey(id), JSON.stringify(options))
  // }

  /* Methods */

  // public static updateActiveTableData(id: string, table: IWorkTableRow[]) {
  //   localStorage.setItem(getLsTableKey(id), JSON.stringify(table))
  // }

  // public static getActiveTableData(id: string) {
  //   return parseLocalStorage<IWorkTableRow[]>(getLsTableKey(id))
  // }
}

export default TableLocalService;
