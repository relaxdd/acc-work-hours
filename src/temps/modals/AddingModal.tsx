import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Actions, useTableContext } from '@/context/TableContext'
import { getDateTimeWithOffset, getFormattedDateTime, roundDateTime } from '@/utils'
import { IWorkTableRow } from '@/types'
import Random from '@/utils/class/Random'

type ExcludeFromTable = 'id' | 'tableId' | 'tech' | 'order'
type ITask = Omit<IWorkTableRow, ExcludeFromTable>

const defTask: ITask = {
  start: '',
  finish: '',
  isPaid: false,
  entity: '',
  description: '',
}

function getDateTime(round: number) {
  const dt = getFormattedDateTime()
  const start = round ? roundDateTime(dt, round) : dt
  const finish = getDateTimeWithOffset(1.5, start)

  return { start, finish }
}

function getDefTask(round: number): ITask {
  return { ...defTask, ...getDateTime(round) }
}

const AddingModal = () => {
  const [{
    visibility,
    options,
    activeTable,
    modifiedTable,
    selectedRows,
  }, dispatch] = useTableContext()

  const [state, setState] = useState(getDefTask(options.dtRoundStep))
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current || !visibility.adding) return

    const close = ref.current?.querySelector<HTMLButtonElement>('button.btn-close')
    close?.addEventListener('click', cancelCreate)

    setState(prev => ({ ...prev, ...getDateTime(options.dtRoundStep) }))

    if (!state.entity)
      setState(prev => ({ ...prev, entity: options.listOfTech[0]!.key }))

    return () => {
      close?.removeEventListener('click', cancelCreate)
    }
  }, [visibility.adding])

  function handleClose() {
    dispatch({
      type: Actions.Visible,
      payload: {
        key: 'adding', value: false,
      },
    })
  }

  function cancelCreate() {
    setState(defTask)
    handleClose()
  }

  function addNewTableRow() {
    const item: IWorkTableRow = {
      id: Random.uuid(),
      tableId: activeTable!,
      ...state,
      order: modifiedTable.length + 1,
    }

    const table = [...modifiedTable, item]

    dispatch({
      type: Actions.State,
      payload: {
        modifiedTable: table,
        selectedRows: [...selectedRows, item.id],
      },
    })

    cancelCreate()
  }

  return (
    <Modal
      show={visibility.adding}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
    >
      <Modal.Header closeButton ref={ref}>
        <Modal.Title>Новая задача</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <input
            type="datetime-local"
            className="form-control"
            value={state.start}
            max={state.finish}
            onChange={({ target }) => {
              setState(prev => ({ ...prev, start: target.value }))
            }}
          />
        </div>

        <div className="mb-3">
          <input
            type="datetime-local"
            className="form-control"
            value={state.finish}
            min={state.start}
            onChange={({ target }) => {
              setState(prev => ({ ...prev, finish: target.value }))
            }}
          />
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={state.entity}
            onChange={({ target }) => {
              setState(prev => ({ ...prev, entity: target.value }))
            }}
          >
            {options.listOfTech.map((it, i) => (
              <option value={it.key} key={i}>{it.text}</option>
            ))}
          </select>
        </div>

        <div className="form-check form-check-inline mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={state.isPaid}
            onChange={() => {
              setState(prev => ({ ...prev, isPaid: !state.isPaid }))
            }}
          />

          <label>Оплачено</label>
        </div>

        <div>
          <textarea
            className="form-control"
            rows={5}
            placeholder="Описание задачи, можно оставить пустым"
            value={state.description}
            onChange={({ target }) => {
              setState(prev => ({ ...prev, description: target.value }))
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <input
          type="button"
          className="btn btn-secondary"
          value="Отмена"
          onClick={cancelCreate}
        />

        <input
          type="button"
          className="btn btn-primary"
          value="Добавить"
          onClick={addNewTableRow}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default AddingModal