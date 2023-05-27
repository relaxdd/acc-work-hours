import React, { useEffect, useMemo, useState } from 'react'
import { getAllIds, getDiffOfHours, getHoursOrZero, getTypedKeys, roundNumber } from 'utils'
import { Actions, useTableContext } from 'context/TableContext'
import { LangEnum } from 'types'

const TableFoot = () => {
  const [{ filteredTable, selectedRows, listOfRate }, dispatch, payload] = useTableContext()
  const [checkAll, setCheckAll] = useState(true)

  const [totalHours, totalPayment] = useMemo(() => {
    const filtered = filteredTable.filter(it => selectedRows.includes(it.id))

    return filtered.reduce((total, it) => {
      const hours = getHoursOrZero(getDiffOfHours(it.start, it.finish))

      return [
        total[0] + hours,
        total[1] + (hours * listOfRate[it.lang]),
      ]
    }, [0, 0] as [number, number])
  }, [filteredTable, selectedRows])

  useEffect(() => {
    if (!selectedRows.length) setCheckAll(false)
    else setCheckAll(true)
  }, [selectedRows])

  function dispatchSelect(value: string[]) {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('selectedRows', value),
    })
  }

  function toggleCheckAll(value: boolean) {
    setCheckAll(prev => !prev)

    if (!value) dispatchSelect([])
    else dispatchSelect(getAllIds(filteredTable))
  }

  function calcAmountByLang() {
    const filtered = filteredTable.filter(it => selectedRows.includes(it.id))

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
    }).join(' + ')
  }, [filteredTable, selectedRows])

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
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td colSpan={4}>Итоговая сумма оплаты</td>
      <td>{roundNumber(totalPayment).toFixed(2)} ₽</td>
      <td colSpan={4}>{textAmountsByLang}</td>
    </tr>
    </tfoot>
  )
}

export default TableFoot