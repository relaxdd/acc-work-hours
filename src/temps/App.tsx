import Table from "./table/Table"
import Wrapper from "./Wrapper"
import Random from "../utils/class/Random"
import { IWorkData } from "../types"
import { defTableContext, ITableStore, TableContext, tableReducer } from "../context/TableContext"
import { LS_DATA_KEY } from "../data"
import { useReducer } from "react"
import TableButtons from "./table/TableButtons"
import Filter from "./filter/Filter"
import { getListOfRate } from "../utils"

type LegacyWorkData = Omit<IWorkData, "id"> & { id?: string }

export const defWorkData: (LegacyWorkData | IWorkData)[] = JSON.parse(localStorage.getItem(LS_DATA_KEY) ?? "[]")

export function formatLegacy() {
  return defWorkData.map((it) => {
    return "id" in it ? it : { ...it, id: Random.uuid() }
  }) as IWorkData[]
}

export function getAllIds(data: IWorkData[]): string[] {
  return data.map(it => it.id)
}

function getDefStore(): ITableStore {
  const workHours = formatLegacy()
  const selected = getAllIds(workHours)
  const listOfRate = getListOfRate()

  return {
    ...defTableContext,
    workHours, selected, listOfRate,
  }
}

function App() {
  const reducer = useReducer(tableReducer, getDefStore())

  return (
    <Wrapper>
      <TableContext.Provider value={reducer}>
        <Filter />
        <Table />
        <TableButtons />
      </TableContext.Provider>
    </Wrapper>
  )
}

export default App
