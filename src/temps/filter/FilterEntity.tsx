import React, { ChangeEvent } from 'react'
import { Actions, useTableContext } from '@/context/TableContext'

const FilterEntity = () => {
  const [{ filter, options }, dispatch] = useTableContext()

  function dispatchLang({ target }: ChangeEvent<HTMLSelectElement>) {
    dispatch({
      type: Actions.Filter,
      payload: {
        key: 'entity',
        value: target.value !== 'none' ? options.listOfTech.find(it => it.key === target.value)!.id : 'none',
      },
    })
  }

  return (
    <select
      className="form-select"
      value={filter.entity !== 'none' ? options.listOfTech.find(it => it.id === filter.entity)?.key : 'none'}
      onChange={dispatchLang}
    >
      <option value="none">Сущность</option>

      {options.listOfTech.map((it, i) => (
        <option value={it.key} key={i}>{it.text}</option>
      ))}
    </select>
  )
}

export default FilterEntity