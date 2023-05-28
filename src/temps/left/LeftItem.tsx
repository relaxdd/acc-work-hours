import React, { FC } from 'react'
import { Actions, useTableContext } from '@/context/TableContext'
import TableService from '@/service/TableService'
import scss from './Left.module.scss'
import select from '@svg/select.svg'
import greenSelect from '@svg/select-green.svg'
import remove from '@svg/remove-bold-red.svg'
import caret from '@svg/caret-down-big.svg'
import { IWorkTableWithActive } from '@/temps/left/Left'

interface LeftItemProps {
  data: IWorkTableWithActive
  toggle: (id: string) => void
}

const LeftItem: FC<LeftItemProps> = ({ data, toggle }) => {
  const [{ activeTable }, dispatch, payload] = useTableContext()

  function isActive() {
    return activeTable === data.id
  }

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
    if (isActive()) return

    dispatch({
      type: Actions.Rewrite,
      payload: payload('activeTable', data.id),
    })

    TableService.activeTable = data.id
  }

  function onToggleDetails() {
    toggle(data.id)
  }

  function getDisplayDateTime() {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: 'numeric', minute: 'numeric',
    }

    return new Date(data.created).toLocaleString('Ru-ru', options)
  }

  return (
    <div className={`${scss.item} ${data.isVisible ? scss.itemDetails : ''}`}>
      <div className={scss.header}>
        <div className={scss.info} onClick={onToggleDetails}>
          <button><img src={caret} alt="toggle-details"/></button>
          <p className={scss.name}>{data.name}</p>
        </div>

        <div className={scss.actions}>
          <button
            onClick={setActiveTable}
            disabled={isActive()}
            title={isActive() ? 'Таблица уже выбрана' : 'Выбрать эту таблицу'}
          >
            <img src={isActive() ? greenSelect : select} alt="btn-select"/>
          </button>

          <button onClick={removeWorkTable} title="Удалить эту таблицу">
            <img src={remove} alt="btn-delete"/>
          </button>
        </div>
      </div>

      <div className={scss.details}>
        <p>
          <span className={scss.detailsName}>Дата создания: </span>
          <span className={scss.detailsValue}>{getDisplayDateTime()}</span>
        </p>

        <p>
          <span className={scss.detailsName}>Количество строк: </span>
          <span className={scss.detailsValue}>{data.count} шт.</span>
        </p>

        <p>
          <span className={scss.detailsName}>Пароль: </span>
          <span className={scss.detailsValue}>{data.password ? 'Да' : 'Нет'}</span>
        </p>
      </div>
    </div>
  )
}

export default LeftItem