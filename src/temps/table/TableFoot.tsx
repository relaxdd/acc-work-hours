import React, { useEffect, useMemo, useState } from 'react'
import { getDiffOfHours, getHoursOrZero, getTypedKeys, roundNumber } from "../../utils"
import { Actions, useTableContext } from "../../context/TableContext"
import { getAllIds } from "../App"
import { LangEnum } from "../../types"

const TableFoot = () => {
  const [{ filteredWH, selected, listOfRate }, dispatch] = useTableContext()
  const [checkAll, setCheckAll] = useState(true)

  const [totalHours, totalPayment] = useMemo(() => {
    const filtered = filteredWH.filter(it => selected.includes(it.id))

    return filtered.reduce((total, it) => {
      const hours = getHoursOrZero(getDiffOfHours(it.start, it.finish))

      return [
        total[0] + hours,
        total[1] + (hours * listOfRate[it.lang]),
      ]
    }, [0, 0] as [number, number])
  }, [filteredWH, selected])

  useEffect(() => {
    if (!selected.length) setCheckAll(false)
    else setCheckAll(true)
  }, [selected])

  function dispatchSelect(value: string[]) {
    dispatch({
      type: Actions.Rewrite,
      payload: { key: "selected", value },
    })
  }

  function toggleCheckAll(value: boolean) {
    setCheckAll(prev => !prev)

    if (!value) dispatchSelect([])
    else dispatchSelect(getAllIds(filteredWH))
  }

  function calcAmountByLang() {
    const filtered = filteredWH.filter(it => selected.includes(it.id))

    return filtered.reduce((list, { lang, start, finish }) => {
      const hours = getHoursOrZero(getDiffOfHours(start, finish))
      list[lang] = (list?.[lang] || 0) + hours

      return list
    }, {} as { [key in LangEnum]: number })
  }

  const textAmountsByLang = useMemo(() => {
    const list = calcAmountByLang()

    return getTypedKeys(list).map((key) => {
      return `(${listOfRate[key]} * ${roundNumber(list[key], 2)})`
    }).join(" + ")
  }, [filteredWH, selected])

  return (
    <tfoot>
    <tr>
      <td colSpan={4}>Всего рабочих часов</td>
      <td colSpan={1}>{totalHours} ч.</td>
      <td colSpan={2}>Выбрать всё</td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={checkAll}
          onChange={() => toggleCheckAll(!checkAll)}
        />
      </td>
    </tr>
    <tr>
      <td colSpan={4}>Итоговая сумма оплаты</td>
      <td>{roundNumber(totalPayment).toFixed(2)} ₽</td>
      <td colSpan={3}>{textAmountsByLang}</td>
    </tr>
    </tfoot>
  )
}

export default TableFoot