import React, { ChangeEvent } from 'react'
import { getTypedKeys } from "../../utils"
import { listOfLang } from "../../data"
import { Actions, useTableContext } from "../../context/TableContext"
import { LangEnum } from "../../types"

const FilterLang = () => {
  const [{ filter }, dispatch] = useTableContext()

  function dispatchLang({ target }: ChangeEvent<HTMLSelectElement>) {
    dispatch({
      type: Actions.Filter,
      payload: {
        key: "lang",
        value: target.value as LangEnum,
      },
    })
  }

  return (
    <select
      className="form-select"
      value={filter.lang}
      onChange={dispatchLang}
    >
      <option value="none">Фильтровать по ЯП</option>

      {getTypedKeys(listOfLang).map((it, i) => (
        <option value={it} key={i}>{listOfLang[it]}</option>
      ))}
    </select>
  )
}

export default FilterLang