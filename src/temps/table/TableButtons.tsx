import React from 'react'
import CompareData from 'utils/class/CompareData'
import { IWorkTableRow } from 'types'
import { getAllIds, getDateTimeWithOffset, getFormattedDateTime, roundDateTime } from 'utils'
import Random from 'utils/class/Random'
import { Actions, useTableContext } from 'context/TableContext'
import TableService from '../../service/TableService'

const TableButtons = () => {
  const [{
    initialTable,
    modifiedTable,
    options,
    activeTable,
    selectedRows,
  }, dispatch, payload] = useTableContext()

  function dispatchModifiedTable(table: IWorkTableRow[]) {
    dispatch({
      type: Actions.State,
      payload: {
        modifiedTable: table,
        selectedRows: getAllIds(table),
      },
    })
  }

  function addTableRow() {
    const start = roundDateTime(getFormattedDateTime(), options.dtRoundStep)
    const finish = getDateTimeWithOffset(1.5, start)

    const item: IWorkTableRow = {
      id: Random.uuid(),
      tableId: Random.uuid(),
      start,
      finish,
      lang: 'js',
      isPaid: false,
      description: '',
    }

    const table = [...modifiedTable, item]

    dispatch({
      type: Actions.State,
      payload: {
        modifiedTable: table,
        selectedRows: [...selectedRows, item.id],
      },
    })
  }

  function saveWorkTableData() {
    TableService.updateActiveTableData(activeTable!, modifiedTable)

    dispatch({
      type: Actions.Rewrite,
      payload: payload('initialTable', modifiedTable),
    })
  }

  function showExportData() {
    const list = TableService.getActiveTableData(activeTable!)

    if (!list.length) {
      alert('База рабочих часов пуста!')
      return
    }

    window.navigator.clipboard.writeText(JSON.stringify(list))
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
        disabled={CompareData.isEquals(initialTable, modifiedTable)}
        onClick={() => dispatchModifiedTable(initialTable)}
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
        disabled={CompareData.isEquals(initialTable, modifiedTable)}
        onClick={saveWorkTableData}
      />
    </div>
  )
}

export default TableButtons