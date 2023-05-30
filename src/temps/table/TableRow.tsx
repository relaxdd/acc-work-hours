import React, { FC, useEffect, useRef, useState } from 'react'
import { formatDate, getDiffOfHours, getHoursOrZero, getTimeByDT } from '@/utils'
import type { FieldsEnum, IWorkTableRow } from '@/types'
import { DTEnum } from '@/types'
import { Actions, ChangeDateTime, useTableContext } from '@/context/TableContext'
import { TableRowActions } from '@/temps/table/Table'

type Nullable<T> = T | null

type WriterList = {
  [key in FieldsEnum]: boolean
}

interface WTRowProps {
  data: IWorkTableRow,
  index: number,
  changeDT: ChangeDateTime,
  onAction: (action: TableRowActions, id: string) => void
}

const defWritingData: WriterList = {
  start: false,
  finish: false,
  entity: false,
  paid: false,
}

function calcWorkHours(data: IWorkTableRow) {
  return getHoursOrZero(getDiffOfHours(data.start, data.finish))
}

const TableRow: FC<WTRowProps> = ({ data, index, changeDT, onAction }) => {
  const [{ filteredTable, selectedRows, options }, dispatch, payload] = useTableContext()
  // state
  const [writingMode, setWritingMode] = useState(defWritingData)
  const [diffDate, setDiffDate] = useState(formatDate(data))
  const [qtyHours, setQtyHours] = useState(() => calcWorkHours(data))
  // ref
  const startRef = useRef<Nullable<HTMLInputElement>>(null)
  const finishRef = useRef<Nullable<HTMLInputElement>>(null)
  const langRef = useRef<Nullable<HTMLSelectElement>>(null)
  const paidRef = useRef<Nullable<HTMLInputElement>>(null)

  const changeWritingMode = (type: FieldsEnum, value: boolean) => {
    setWritingMode(prev => ({ ...prev, [type]: value }))
  }

  useEffect(() => {
    if (writingMode.start) startRef.current?.focus()
    if (writingMode.finish) finishRef.current?.focus()
    if (writingMode.entity) langRef.current?.focus()
    if (writingMode.paid) paidRef.current?.focus()
  }, [writingMode])

  useEffect(() => {
    setQtyHours(calcWorkHours(data))
  }, [filteredTable])

  function onBlurHandle(type: DTEnum) {
    changeWritingMode(type, false)
    setDiffDate(formatDate(data))
    setQtyHours(getDiffOfHours(data.start, data.finish))
  }

  function preChange(key: DTEnum, value: string) {
    const check = (() => {
      switch (key) {
        case 'start':
          return value < data.finish
        case 'finish':
          return value > data.start
      }
    })()

    if (!check) return

    changeDT(key, value, data.id)
  }

  function onPressHandle(e: React.KeyboardEvent<HTMLTableRowElement>) {
    e.preventDefault()

    switch (e.code) {
      case (options?.usingKeys?.delete || 'Delete'):
        const msg = `Хотите удалить строку '${index + 1}'?`
        if (!window.confirm(msg)) return
        onAction('delete', data.id)
        break
      case (options?.usingKeys?.up || 'ArrowUp'):
        onAction('moveUp', data.id)
        break
      case (options?.usingKeys?.down || 'ArrowDown'):
        onAction('moveDown', data.id)
        break
    }
  }

  function dispatchSelected(value: string[]) {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('selectedRows', value),
    })
  }

  function toggleCheckHours() {
    if (selectedRows.includes(data.id))
      dispatchSelected(selectedRows.filter(it => it !== data.id))
    else
      dispatchSelected([...selectedRows, data.id])
  }

  return (
    <tr tabIndex={index} onKeyDown={onPressHandle}>
      {!options.hiddenCols.number && (
        <td>{index + 1}</td>
      )}
      <td>{diffDate}</td>
      <td
        onDoubleClick={() => changeWritingMode('start', true)}
      >
        {writingMode.start
          ? (
            <input
              type="datetime-local"
              className="form-control"
              value={data.start}
              max={data.finish}
              onChange={({ target }) => preChange('start', target.value)}
              onBlur={() => onBlurHandle('start')}
              ref={startRef}
            />
          )
          : getTimeByDT(data.start)}
      </td>
      <td
        onDoubleClick={() => changeWritingMode('finish', true)}
      >
        {writingMode.finish
          ? (
            <input
              type="datetime-local"
              className="form-control"
              value={data.finish}
              min={data.start}
              onChange={({ target }) => preChange('finish', target.value)}
              onBlur={() => onBlurHandle('finish')}
              ref={finishRef}
            />
          )
          : getTimeByDT(data.finish)}
      </td>
      <td>{qtyHours} ч.</td>
      <td
        onDoubleClick={() => changeWritingMode('entity', true)}
      >
        {writingMode.entity
          ? (
            <select
              className="form-select"
              value={data.entity}
              onChange={({ target }) => {
                dispatch({
                  type: Actions.WH_Item,
                  payload: {
                    key: 'entity', id: data.id, value: target.value,
                  },
                })
              }}
              onBlur={() => changeWritingMode('entity', false)}
              ref={langRef}
            >
              {options.listOfTech.map((it, i) => (
                <option value={it.key} key={i}>{it.text}</option>
              ))}
            </select>
          )
          : data.entity}
      </td>
      <td
        onDoubleClick={() => changeWritingMode('paid', true)}
      >
        {writingMode.paid
          ? (
            <input
              type="checkbox"
              checked={data.isPaid}
              className="form-check-input"
              ref={paidRef}
              onBlur={() => changeWritingMode('paid', false)}
              onChange={() => {
                dispatch({
                  type: Actions.WH_Item,
                  payload: {
                    key: 'isPaid', id: data.id, value: !data.isPaid,
                  },
                })
              }}
            />
          )
          : (data.isPaid
            ? (<span className="text-success">✓</span>)
            : (<span className="text-danger">✗</span>))
        }
      </td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={selectedRows.includes(data.id)}
          onChange={toggleCheckHours}
        />
      </td>
      {!options.hiddenCols.description && (
        <td
          style={{ padding: '5px 7px' }}
          onDoubleClick={(e) => {
            e.preventDefault()

            dispatch({
              type: Actions.Rewrite,
              payload: payload('modalVisible', {
                id: data.id, visible: true,
              }),
            })
          }}
        >
          {data.description.slice(0, 35).trim() + (data.description.length > 25 ? '...' : '')}
        </td>
      )}
    </tr>
  )
}

export default TableRow