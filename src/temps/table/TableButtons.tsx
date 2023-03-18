import React from 'react'
import CompareData from '../../utils/class/CompareData'
import { defWorkData, formatLegacy } from '../App'
import { LS_DATA_KEY } from '../../data'
import { IWorkData } from '../../types'
import { getDateTimeWithOffset, getFormattedDateTime, roundDateTime } from '../../utils'
import Random from '../../utils/class/Random'
import { Actions, useTableContext } from '../../context/TableContext'

function createItem(): IWorkData {
  const start = roundDateTime(getFormattedDateTime())
  const finish = getDateTimeWithOffset(1, start)

  return {
    id: Random.uuid(),
    start,
    finish,
    lang: 'js',
    isPaid: false,
  }
}

const TableButtons = () => {
  const [{ workHours }, dispatch] = useTableContext()

  function dispatchWorkHours(value: IWorkData[]) {
    dispatch({
      type: Actions.Rewrite,
      payload: { key: 'workHours', value },
    })
  }

  function addTableRow() {
    const item = createItem()
    dispatchWorkHours([...workHours, item])
  }

  function saveWorkTableData() {
    localStorage.setItem(LS_DATA_KEY, JSON.stringify(workHours))
    window.location.reload()
  }

  function showExportData() {
    const json = localStorage.getItem(LS_DATA_KEY)

    if (!json) {
      alert('База рабочих часов пуста!')
      return
    }

    window.navigator.clipboard.writeText(json)
      .then(() => {
        alert('База рабочих часов успешно скопирована в буфер обмена')
      })
      .catch(err => {
        console.error(err)
        alert('Не удалось получить данные!')
      })
  }

  return (
    <div
      className="d-flex justify-content-end"
      style={{ columnGap: '5px', marginBottom: '20px' }}
    >
      <input
        type="button"
        value="Экспорт"
        className="btn btn-outline-dark"
        onClick={showExportData}
      />
      <input
        type="button"
        value="Сбросить"
        className="btn btn-outline-danger"
        disabled={CompareData.isEquals(defWorkData, workHours)}
        onClick={() => dispatchWorkHours(formatLegacy())}
      />
      <input
        type="button"
        value="Добавить"
        className="btn btn-secondary"
        onClick={addTableRow}
      />
      <input
        type="button"
        value="Сохранить"
        className="btn btn-primary"
        disabled={CompareData.isEquals(defWorkData, workHours)}
        onClick={saveWorkTableData}
      />
    </div>
  )
}

export default TableButtons