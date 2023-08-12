import React, { ChangeEvent } from 'react'
import { Actions, ListOfSorting, useTableContext } from '@/context/TableContext'

const SortDate = () => {
  const [{ sorting }, dispatch, payload] = useTableContext()

  function setSorting(e: ChangeEvent<HTMLSelectElement>) {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('sorting', e.target.value as ListOfSorting),
    })
  }

  return (
    <select
      className="form-select"
      value={sorting}
      onChange={setSorting}
    >
      <option value="order-asc">По умолчанию</option>
      <option value="date-asc">По дате ASC</option>
      <option value="date-desc">По дате DESC</option>
    </select>
  )
}

export default SortDate