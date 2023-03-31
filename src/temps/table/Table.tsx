import scss from './Table.module.scss'
import { FC, useEffect } from 'react'
import TableRow from './TableRow'
import TableHead from './TableHead'
import { Actions, ChangeDateTime, useTableContext } from '../../context/TableContext'
import TableFoot from './TableFoot'
import { IWorkData, LangEnum } from '../../types'

class Sorting {
  public static byLang(lang: LangEnum | 'none', list: IWorkData[]) {
    return lang !== 'none'
      ? list.filter((it) => it.lang === lang) : list
  }

  public static byDate(date: string, list: IWorkData[]) {
    return date !== 'none'
      ? list.filter(it => it.start.split('T')[0] === date) : list
  }
}

const Table: FC = () => {
  const [{ workHours, filter, filteredWH }, dispatch] = useTableContext()

  const changeDT: ChangeDateTime = (key, value, id) => {
    dispatch({ type: Actions.WH_Item, payload: { key, value, id } })
  }

  function deleteTableRow(id: string) {
    const filtered = workHours.filter(it => it.id !== id)

    dispatch({
      type: Actions.Rewrite,
      payload: { key: 'workHours', value: filtered },
    })
  }

  function dispatchFWH(value: IWorkData[]) {
    dispatch({
      type: Actions.Rewrite,
      payload: { key: 'filteredWH', value },
    })
  }

  useEffect(() => {
    const byDate = Sorting.byDate(filter.date, workHours)
    const byLang = Sorting.byLang(filter.lang, byDate)

    dispatchFWH(byLang)
  }, [workHours, filter])

  return (
    <table className={scss.table}>
      <TableHead />

      <tbody>
      {filteredWH.map((it, i) => (
        <TableRow
          data={it}
          index={i}
          changeDT={changeDT}
          deleteTableRow={deleteTableRow}
          key={it.id}
        />
      ))}
      </tbody>

      <TableFoot />
    </table>
  )
}

export default Table