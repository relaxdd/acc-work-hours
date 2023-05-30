import React, { FC, useEffect, useRef, useState } from 'react'
import { Actions, useTableContext } from '@/context/TableContext'
import TableService from '@/service/TableService'
import type { IWorkTableWithActive } from '@/temps/left/Left'
import scss from './Left.module.scss'
import select from '@svg/select.svg'
import greenSelect from '@svg/select-green.svg'
import remove from '@svg/remove-bold-red.svg'
import caret from '@svg/caret-down-big.svg'
import edit from '@svg/edit.svg'

interface DetailsProps {
  item: IWorkTableWithActive
}

const Details: FC<DetailsProps> = ({ item }) => {
  function getDisplayDateTime() {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: 'numeric', minute: 'numeric',
    }

    return new Date(item.created).toLocaleString('Ru-ru', options)
  }

  return (
    <div className={scss.details}>
      <p>
        <span className={scss.detailsName}>Идентификатор: </span>
        <span className={scss.detailsValue}>{item.id}</span>
      </p>

      <p>
        <span className={scss.detailsName}>Дата создания: </span>
        <span className={scss.detailsValue}>{getDisplayDateTime()}</span>
      </p>

      <p>
        <span className={scss.detailsName}>Количество строк: </span>
        <span className={scss.detailsValue}>{item.count} шт.</span>
      </p>

      <p>
        <span className={scss.detailsName}>Пароль: </span>
        <span className={scss.detailsValue}>{item.password ? 'Да' : 'Нет'}</span>
      </p>
    </div>
  )
}

interface LeftItemProps {
  data: IWorkTableWithActive,
  onToggle: (id: string, force?: boolean) => void,
  onRename: (id: string, name: string) => void
}

const LeftItem: FC<LeftItemProps> = ({ data, onToggle, onRename }) => {
  const [{ activeTable }, dispatch, payload] = useTableContext()
  const [rename, setRename] = useState(false)
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!rename) return
    ref.current?.focus()
  }, [rename])

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
    if (rename) return
    onToggle(data.id)
  }

  function onRenameTable() {
    onToggle(data.id, false)
    setRename(true)
  }

  function saveNewName(name: string) {
    if (data.name !== name)
      onRename(data.id, name)

    setRename(false)
  }

  return (
    <div className={`${scss.item} ${data.isVisible ? scss.itemDetails : ''}`}>
      <div className={scss.header}>
        <div className={scss.info} onClick={onToggleDetails}>
          <button><img src={caret} alt="toggle-details"/></button>

          {rename
            ? (
              <input
                type="text"
                className="form-control"
                defaultValue={data.name}
                ref={ref}
                onBlur={({ target }) => {
                  saveNewName(target.value)
                }}
                onKeyUp={(e) => {
                  if (e.code !== 'Enter') return
                  saveNewName((e.target as HTMLInputElement).value)
                }}
              />
            )
            : (<p className={scss.name}>{data.name}</p>)
          }

        </div>

        <div className={scss.actions}>
          <button
            onClick={onRenameTable}
            title="Переименовать таблицу"
          >
            <img src={edit} alt="edit-icon" style={{ height: '16px' }}/>
          </button>

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

      <Details item={data}/>
    </div>
  )
}

export default LeftItem