import React from 'react'
import CompareData from 'utils/class/CompareData'
import { ITableOptions, IWorkTableRow } from 'types'
import { getAllIds, getDateTimeWithOffset, getFormattedDateTime, roundDateTime } from 'utils'
import Random from 'utils/class/Random'
import { Actions, useTableContext } from 'context/TableContext'
import TableService from '@/service/TableService'

type ImportActions = 'overwrite' | 'merge'

const TableButtons = () => {
  const [{
    initialTable,
    modifiedTable,
    options,
    activeTable,
    selectedRows,
    listOfTables,
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
    const dt = getFormattedDateTime()
    const start = options.dtRoundStep ? roundDateTime(dt, options.dtRoundStep) : dt
    const finish = getDateTimeWithOffset(1.5, start)

    if (!options.listOfTech.length) {
      alert('Ошибка: Добавьте варианты сущностей!')
      return
    }

    const item: IWorkTableRow = {
      id: Random.uuid(),
      tableId: Random.uuid(),
      start,
      finish,
      tech: options.listOfTech[0]!.key,
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
    const updated = listOfTables.map((it) => {
      return it.id === activeTable
        ? { ...it, count: modifiedTable.length } : it
    })

    dispatch({
      type: Actions.State,
      payload: {
        initialTable: modifiedTable,
        listOfTables: updated,
      },
    })

    TableService.updateActiveTableData(activeTable!, modifiedTable)
    TableService.listOfTablesInfo = updated
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

  function importTableData() {
    let overwrite = false

    if (initialTable.length > 0) {
      const actions = [['no', '0', 'n', 'нет'], ['yes', '1', 'y', 'да']]
      const msg = `Таблица не пуста, выберите действие: перезаписать или объединить (y/n)`

      const result = window.prompt(msg)
      if (!result) return

      const choice = actions.findIndex((it) => {
        return it.includes(result.toLowerCase())
      })

      if (choice === -1) return
      overwrite = Boolean(choice)
    }

    const input = document.createElement('input')

    input.setAttribute('type', 'file')
    input.setAttribute('accept', '.json')

    input.addEventListener('change', (e: any) => {
      const file = e?.target?.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.readAsText(file)

      // TODO: Добавить валидацию таблицы
      reader.onload = function () {
        if (!reader.result) return

        console.log(overwrite)

        try {
          const data = JSON.parse(reader.result as string) as IWorkTableRow[]
          const tech = data.reduce<string[]>((list, it) => {
            if (!list.includes(it.tech)) list.push(it.tech)
            return list
          }, [])

          const prevTech = options.listOfTech.map(({ key }) => key)
          const extra = [...tech, ...prevTech]

          if (extra.length !== prevTech.length) {
            const list = tech.filter(key => !prevTech.includes(key)).map((it, i) => ({
              key: it, text: `Текст - ${i + 1}`, rate: 100,
            }))

            const update: ITableOptions = {
              ...options, listOfTech: overwrite
                ? list : [...options.listOfTech, ...list],
            }

            dispatch({
              type: Actions.Rewrite,
              payload: payload('options', update),
            })

            TableService.updateActiveOptions(activeTable!, update)
          }

          const tables = overwrite ? data : [...modifiedTable, ...data]

          dispatch({
            type: Actions.State,
            payload: {
              modifiedTable: tables,
              selectedRows: tables.map(({ id }) => id),
            },
          })
        } catch (err) {
          console.error(err)
          alert('Не удалось прочитать файл!')
        }
      }

      reader.onerror = function () {
        console.error(reader.error)
        alert('Не удалось прочитать файл!')
      }
    })

    input.click()
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
        value="Импорт"
        className="btn btn-outline-secondary"
        onClick={importTableData}
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
        value="Сохранить"
        className="btn btn-primary"
        disabled={CompareData.isEquals(initialTable, modifiedTable)}
        onClick={saveWorkTableData}
      />

      <input
        type="button"
        value="Добавить"
        className="btn btn-secondary"
        onClick={addTableRow}
      />
    </div>
  )
}

export default TableButtons