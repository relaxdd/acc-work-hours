import scss from './Table.module.scss'
import { FC, useEffect } from 'react'
import TableRow from './TableRow'
import TableHead from './TableHead'
import { Actions, ChangeDateTime, useTableContext } from '@/context/TableContext'
import TableFoot from './TableFoot'
import { IWorkTableRow } from '@/types'

class Sorting {
  public static byTech(tech: string | 'none', list: IWorkTableRow[]) {
    return tech !== 'none'
      ? list.filter((it) => it.tech === tech) : list
  }

  public static byDate(date: string | 'none', list: IWorkTableRow[]) {
    return date !== 'none'
      ? list.filter(it => it.start.split('T')[0] === date) : list
  }
}

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

  function dispatchFilteredTable(value: IWorkTableRow[]) {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('filteredTable', value),
    })
  }

  useEffect(() => {
    const byDate = Sorting.byDate(filter.date, modifiedTable)
    const byLang = Sorting.byTech(filter.tech, byDate)

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
          deleteTableRow={deleteTableRow}
          key={it.id}
        />
      ))}
      </tbody>

      <TableFoot/>
    </table>
  )
}

export default Table