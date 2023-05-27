import React, { FC } from 'react'
import select from 'assets/svg/select.svg'
import remove from 'assets/svg/remove-bold-red.svg'
import scss from './Left.module.scss'
import { Actions, PartOfWorkTable, useTableContext } from 'context/TableContext'
import TableService from 'service/TableService'

interface LeftItemProps {
  data: PartOfWorkTable
}

const LeftItem: FC<LeftItemProps> = ({ data }) => {
  const [{ activeTable }, dispatch, payload] = useTableContext()

  function removeWorkTable() {
    const msg = 'Вы уверены что хотите удалить эту таблицу?'
    const check = window.confirm(msg)

    if (!check) return

    const list = TableService.deleteWorkTable(data.id)

    if (list === false) {
      console.warn('Ошибка удаления таблицы!')
      return
    }

    dispatch({
      type: Actions.State,
      payload: {
        listOfTables: list,
        activeTable: list.length ? list[0]!.id : null,
      },
    })
  }

  function setActiveTable() {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('activeTable', data.id),
    })

    TableService.activeTable = data.id
  }

  return (
    <div className={scss.item}>
      <p className={scss.name}>{data.name}</p>

      <div className={scss.actions}>
        {activeTable !== data.id && (
          <button onClick={setActiveTable} title="Выбрать эту таблицу">
            <img src={select} alt="btn-select"/>
          </button>
        )}

        <button onClick={removeWorkTable} title="Удалить эту таблицу">
          <img src={remove} alt="btn-delete"/>
        </button>
      </div>
    </div>
  )
}

export default LeftItem