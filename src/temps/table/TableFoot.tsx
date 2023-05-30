import React, { useEffect, useMemo, useState } from 'react'
import { getAllIds, getDiffOfHours, getHoursOrZero, round, roundNumber } from '@/utils'
import { Actions, useTableContext } from '@/context/TableContext'

const TableFoot = () => {
  const [{ filteredTable, selectedRows, options }, dispatch, payload] = useTableContext()
  const [checkAll, setCheckAll] = useState(true)

  useEffect(() => {
    if (!selectedRows.length) setCheckAll(false)
    else setCheckAll(true)
  }, [selectedRows])

  /* ==================================== */

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

  function calcAmountByTech() {
    const filtered = filteredTable.filter(it => selectedRows.includes(it.id))

    return filtered.reduce<Record<string, number>>((list, it) => {
      const diff = getDiffOfHours(it.start, it.finish)
      const hours = getHoursOrZero(diff)

      list[it.entity] = (list?.[it.entity] || 0) + hours

      return list
    }, {})
  }

  /* ==================================== */

  const [totalHours, totalPayment] = useMemo(() => {
    const filtered = filteredTable.filter(it => selectedRows.includes(it.id))

    return filtered.reduce((total, it) => {
      const hours = getHoursOrZero(getDiffOfHours(it.start, it.finish))
      const data = options.listOfTech.find(({ key }) => key === it.entity)

      return [
        total[0] + hours,
        total[1] + (hours * (data?.rate || 0)),
      ]
    }, [0, 0] as [number, number])
  }, [filteredTable, selectedRows, options.listOfTech])

  const textAmountsByLang = useMemo(() => {
    const list = calcAmountByTech()

    return Object.keys(list).map((key) => {
      const data = options.listOfTech.find(it => it.key === key)
      return `(${data?.rate || 0} * ${roundNumber(list[key]!, 2)})`
    }).join(' + ')
  }, [filteredTable, selectedRows, options.listOfTech])

  /* ==================================== */

  return (
    <tfoot>
    <tr>
      <td colSpan={options.hiddenCols.number ? 3 : 4}>Всего рабочих часов</td>
      <td colSpan={1}>{round(totalHours)} ч.</td>
      <td colSpan={options.hiddenCols.entity ? 1 : 2}>Выбрать всё</td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={checkAll}
          onChange={() => toggleCheckAll(!checkAll)}
        />
      </td>
      {!options.hiddenCols.description && (
        <td>&nbsp;</td>
      )}
    </tr>
    <tr>
      <td colSpan={options.hiddenCols.number ? 3 : 4}>Итоговая сумма оплаты</td>
      <td>{roundNumber(totalPayment).toFixed(2)} ₽</td>
      <td colSpan={options.hiddenCols.description ? 3 : 4}>{textAmountsByLang}</td>
    </tr>
    </tfoot>
  )
}

export default TableFoot