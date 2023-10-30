import { AxiosResponse } from "axios";
import { ITableFullData, IWorkTable } from "@/types";
import $api from "@/api/index";

class TableApiService {
  private static domain = "http://localhost:5000";
  private static api = this.domain + "/api";

  public static async getTables(): Promise<IWorkTable[]> {
    try {
      const resp = await $api.get<IWorkTable[]>("/table/");
      return resp.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  public static async getAllData(
    tableId: string | number
  ): Promise<ITableFullData> {
    try {
      const url = "/data/all?tableId=" + tableId;
      const resp = await $api.get<ITableFullData>(url);

      return resp.data;
    } catch (e) {
      console.error(e);
      throw new Error("Во время загрузки данных произошла ошибка!");
    }
  }

  public static async createTable(name: string): Promise<IWorkTable> {
    try {
      const resp = await $api.post<ICreateTable>("/table", { name });
      return resp.data.table;
    } catch (e) {
      console.error(e);
      throw new Error("Ошибка: не удалось создать таблицу!");
    }
  }

  public static async renameTable(tableId: number, name: string) {
    try {
      await $api.patch("/table/" + tableId, { name });
    } catch (e) {
      console.error(e);
      throw new Error("Ошибка: не удалось переименовать таблицу!");
    }
  }

  public static async deleteTable(tableId: string | number) {
    try {
      await $api.delete("/table/" + tableId);
    } catch (e) {
      console.error(e);
      throw new Error("Ошибка: не удалось удалить таблицу!");
    }
  }

  // ************** Private methods **************

  private static validate({ headers, status }: AxiosResponse<any, any>) {
    return (
      headers["content-type"]?.toLowerCase().includes("application/json") &&
      status === 200
    );
  }
}

interface ICreateTable {
  message: string;
  table: IWorkTable;
}

export default TableApiService;
