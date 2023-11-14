import React, { useCallback } from 'react'
import { defOptions, useTableContext } from '@/context/TableContext'
import { getQtyCols, getTypedKeys } from '@/utils'
import { ITableOptionsHidden } from '@/types'

type ListOfCases = '000' | '100' | '010' | '001' | '101' | '110' | '011' | '111'
type ColProps = { width?: number }

/* ======================================== */

const sizes: Record<ListOfCases, number[]> = {
  '000': [5, 18, 12.5, 12.5, 10, 10, 5, 5, 22],
  '100': [15, 14, 14, 10, 10, 7.5, 7.5, 22],
  '010': [5, 18, 14, 14, 10, 7.5, 7.5, 24],
  '001': [5, 20, 17.5, 17.5, 12.5, 12.5, 7.5, 7.5],
  '101': [20, 15, 15, 15, 15, 10, 10],
  '110': [20, 15, 15, 10, 7.5, 7.5, 25],
  '011': [5, 25, 20, 20, 12.5, 8.75, 8.75],
  '111': [20, 20, 20, 20, 10, 10],
}

function getCaseKey(obj: ITableOptionsHidden) {
  const keys = getTypedKeys(defOptions.hiddenCols)
  const arr = keys.map(key => String(Number(obj[key])))
  return arr.join('') as keyof typeof sizes
}

/* ======================================== */

const TableHead = () => {
  const [{ options: { hiddenCols } }] = useTableContext()

  const iterateCols = useCallback((fn: (i: number, props: ColProps) => React.ReactNode) => {
    const key = getCaseKey(hiddenCols)
    const qty = getQtyCols(hiddenCols)

    return [...Array(qty).keys()].map((i) => {
      return fn(i, { width: sizes[key][i]! })
    })
  }, [hiddenCols])

  return (
    <>
      <colgroup>
        {iterateCols((i, props) => (
          <col key={i} {...props} />
        ))}
      </colgroup>
      <thead>
      <tr>
        {!hiddenCols.number && (
          <th>№</th>
        )}
        <th>Дата</th>
        <th>Начал</th>
        <th>Закончил</th>
        <th>Часов</th>
        {!hiddenCols.entity && (
          <th>Сущность</th>
        )}
        <th>&nbsp;</th>
        <th>&nbsp;</th>
        {!hiddenCols.description && (
          <th>Описание</th>
        )}
      </tr>
      </thead>
    </>
  )
}

export default TableHead