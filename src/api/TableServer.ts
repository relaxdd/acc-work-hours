import axios, { AxiosResponse } from 'axios'
import { ITableFullData, ITableOptions, ITableOptionsEntity, IWorkTable, IWorkTableRow } from '@/types'
import $api from '@/api/index'

class TableServer {
  private static domain = 'http://localhost:5000'
  private static api = this.domain + '/api'

  public static async getTables() {
    try {
      const resp = await $api.get<IWorkTable[]>('/table')

      return resp.data
    } catch (e) {
      console.error(e)
      return []
    }
  }

  public static async getAllData(tableId: string) {
    const url = this.api + '?action=all&tableId=' + tableId
    const resp = await axios.get<ITableFullData>(url)

    return resp.data
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

  // ************** Private methods **************

  private static validate({ headers, status }: AxiosResponse<any, any>) {
    return headers['content-type']?.toLowerCase().includes('application/json') && status === 200
  }
}

export default TableServer