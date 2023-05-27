import React, { FC, useEffect, useRef, useState } from 'react'
import { formatDate, getDiffOfHours, getHoursOrZero, getTimeByDT, getTypedKeys } from '../../utils'
import { DTEnum, FieldsEnum, IWorkTableRow, LangEnum } from '../../types'
import { listOfLang } from '../../data'
import { Actions, ChangeDateTime, useTableContext } from '../../context/TableContext'

type Nullable<T> = T | null

type WriterList = {
  [key in FieldsEnum]: boolean
}

interface WTRowProps {
  data: IWorkTableRow,
  index: number,
  changeDT: ChangeDateTime,
  deleteTableRow: (id: string) => void
}

const defWritingData: WriterList = {
  start: false,
  finish: false,
  lang: false,
  paid: false,
}

function calcWorkHours(data: IWorkTableRow) {
  return getHoursOrZero(getDiffOfHours(data.start, data.finish))
}

const TableRow: FC<WTRowProps> = ({ data, index, changeDT, deleteTableRow }) => {
  const [{ filteredTable, selectedRows }, dispatch, payload] = useTableContext()
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
    if (writingMode.lang) langRef.current?.focus()
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

  function onDeleteHandle(e: React.KeyboardEvent<HTMLTableRowElement>) {
    e.preventDefault()

    if (e.key !== 'Delete') return
    if (!window.confirm(`Хотите удалить строку '${index + 1}'?`)) return

    deleteTableRow(data.id)
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
    <tr tabIndex={index} onKeyDown={onDeleteHandle}>
      <td>{index + 1}</td>
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
        onDoubleClick={() => changeWritingMode('lang', true)}
      >
        {writingMode.lang
          ? (
            <select
              className="form-select"
              value={data.lang}
              onChange={({ target }) => {
                dispatch({
                  type: Actions.WH_Item,
                  payload: {
                    key: 'lang', id: data.id,
                    value: target.value as LangEnum,
                  },
                })
              }}
              onBlur={() => changeWritingMode('lang', false)}
              ref={langRef}
            >
              {getTypedKeys(listOfLang).map((key, i) => (
                <option value={key} key={i}>{listOfLang[key]}</option>
              ))}
            </select>
          )
          : data.lang}
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
    </tr>
  )
}

export default TableRow