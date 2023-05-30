import scss from './Table.module.scss'
import { FC, useEffect } from 'react'
import TableRow from './TableRow'
import TableHead from './TableHead'
import { Actions, ChangeDateTime, useTableContext } from '@/context/TableContext'
import TableFoot from './TableFoot'
import { IWorkTableRow } from '@/types'
import ArrayExt from '@/utils/class/ArrayExt'

class Sorting {
  public static byEntity(entity: string | 'none', list: IWorkTableRow[]) {
    return entity !== 'none'
      ? list.filter((it) => it.entity === entity) : list
  }

  public static byDate(date: string | 'none', list: IWorkTableRow[]) {
    return date !== 'none'
      ? list.filter(it => it.start.split('T')[0] === date) : list
  }
}

export type TableRowActions = 'delete' | 'moveUp' | 'moveDown'

const Table: FC = () => {
  const [{ modifiedTable, filter, filteredTable }, dispatch, payload] = useTableContext()

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
    if (index === -1) return

    // (index === 0 && isUp)
    // (index === modifiedTable.length - 1 && !isUp)

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

    // swapArrayItems(list, index, where)
    ArrayExt.move(list, index, where)

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
    const byDate = Sorting.byDate(filter.date, modifiedTable)
    const byLang = Sorting.byEntity(filter.entity, byDate)

    dispatchFilteredTable(byLang)
  }, [modifiedTable, filter])

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