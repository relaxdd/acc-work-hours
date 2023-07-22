import axios, { AxiosResponse } from 'axios'
import { ITableFullData, ITableOptions, ITableOptionsEntity, IWorkTable, IWorkTableRow } from '@/types'

class TableServer {
  private static domain = 'http://localhost'
  private static api = this.domain + '/api/index.php'

  public static async getAllData(tableId: string) {
    const url = this.api + '?action=all&tableId=' + tableId
    const resp = await axios.get<ITableFullData>(url)

    return resp.data
  }

  public static async getTables() {
    const url = this.api + '?action=tables&userId=1'
    const resp = await axios.get<IWorkTable[]>(url)

    return resp.data
  }

  private static validate({ headers, status }: AxiosResponse<any, any>) {
    return headers['content-type']?.toLowerCase() === 'application/json; charset=utf-8' && status === 200
  }

  public static async getRows(id: string) {
    const url = this.api + '?action=rows&tableId=' + id
    const resp = await axios.get<IWorkTableRow[]>(url)

    if (!this.validate(resp)) return []

    return resp.data
  }

  public static async getOptions(id: string) {
    const url = this.api + '?action=options&tableId=' + id
    const resp = await axios.get<ITableOptions>(url)

    return resp.data
  }

  public static async getEntities(id: string) {
    const url = this.api + '?action=entities&tableId=' + id
    const resp = await axios.get<ITableOptionsEntity[]>(url)

    return resp.data
  }
}

export default TableServer