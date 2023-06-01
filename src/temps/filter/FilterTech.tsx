import React, { ChangeEvent } from 'react'
import { Actions, useTableContext } from '@/context/TableContext'

const FilterTech = () => {
  const [{ filter, options }, dispatch] = useTableContext()

  function dispatchLang({ target }: ChangeEvent<HTMLSelectElement>) {
    dispatch({
      type: Actions.Filter,
      payload: { key: 'entity', value: target.value },
    })
  }

  return (
    <select
      className="form-select"
      value={filter.entity}
      onChange={dispatchLang}
    >
      <option value="none">Сущность</option>

      {options.listOfTech.map((it, i) => (
        <option value={it.key} key={i}>{it.text}</option>
      ))}
    </select>
  )
}

export default FilterTech