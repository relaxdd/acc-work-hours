import scss from './Table.module.scss'
import { FC, useEffect } from 'react'
import TableRow from './TableRow'
import TableHead from './TableHead'
import { Actions, ChangeDateTime, ListOfSorting, useTableContext } from '@/context/TableContext'
import TableFoot from './TableFoot'
import { IWorkTableRow } from '@/types'
import arrayExt from '@/utils/class/ArrayExt'

class Filtering {
  public static byEntity(entity: string | 'none', list: IWorkTableRow[]) {
    return entity !== 'none'
      ? list.filter((it) => it.entityId === entity) : list
  }

  public static byDate(date: string | 'none', list: IWorkTableRow[]) {
    return date !== 'none'
      ? list.filter(it => it.start.split('T')[0] === date) : list
  }
}

class Sorting {
  public static sort(method: ListOfSorting, list: IWorkTableRow[]) {
    return list.sort((a, b) => {
      switch (method) {
        case 'order-asc':
          return a.order - b.order
        case 'date-asc':
          return new Date(a.start).getTime() - new Date(b.start).getTime()
        case 'date-desc':
          return new Date(b.start).getTime() - new Date(a.start).getTime()
      }
    })
  }
}

export type TableRowActions = 'delete' | 'moveUp' | 'moveDown'

const Table: FC = () => {
  const [{ modifiedTable, filter, filteredTable, sorting }, dispatch, payload] = useTableContext()

  const changeDateTime: ChangeDateTime = (key, value, id) => {
    dispatch({ type: Actions.WH_Item, payload: { key, value, id } })
  }

  function deleteTableRow(id: string) {
    const filtered = modifiedTable.filter(it => it.id !== id)

    dispatch({
      type: Actions.Rewrite,
      payload: payload('modifiedTable', filtered),
    })
  }

  function moveTableRow(isUp: boolean, id: string) {
    const index = modifiedTable.findIndex(it => it.id === id)

    if (index === -1 ||
      (index === 0 && isUp) ||
      (index === modifiedTable.length - 1 && !isUp)
    ) return

    const list = [...modifiedTable]

    const where = (() => {
      const i = isUp ? index - 1 : index + 1

      if (i < 0)
        return modifiedTable.length - 1
      else if (i >= modifiedTable.length)
        return 0
      else
        return i
    })()

    arrayExt.swapByKey(list, index, where, 'order')

    dispatch({
      type: Actions.Rewrite,
      payload: payload('modifiedTable', list),
    })
  }

  function doTableRowAction(action: TableRowActions, id: string) {
    switch (action) {
      case 'delete':
        deleteTableRow(id)
        break
      case 'moveUp':
        moveTableRow(true, id)
        break
      case 'moveDown':
        moveTableRow(false, id)
        break
    }
  }

  function dispatchFilteredTable(value: IWorkTableRow[]) {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('filteredTable', value),
    })
  }

  useEffect(() => {
    const byDate = Filtering.byDate(filter.date, modifiedTable)
    const byLang = Filtering.byEntity(filter.entity, byDate)
    const bySort = Sorting.sort(sorting, byLang)

    dispatchFilteredTable(bySort)
  }, [modifiedTable, filter, sorting])

  return (
    <table className={scss.table}>
      <TableHead/>

      <tbody>
      {filteredTable.map((it, i) => (
        <TableRow
          data={it}
          index={i}
          changeDT={changeDateTime}
          onAction={doTableRowAction}
          key={it.id}
        />
      ))}
      </tbody>

      <TableFoot/>
    </table>
  )
}

export default Table