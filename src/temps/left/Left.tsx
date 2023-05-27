import React, { useEffect, useState } from 'react'
import { Offcanvas } from 'react-bootstrap'
import LeftFloating from './LeftFloating'
import { Actions, useTableContext } from 'context/TableContext'
import scss from './Left.module.scss'
import LeftItem from './LeftItem'
import TableService from '../../service/TableService'

const Left = () => {
  const [{ leftVisible, listOfTables, activeTable }, dispatch, payload] = useTableContext()

  const [isCreateMode, setCreateMode] = useState(false)
  const [name, setName] = useState(getDefName)

  useEffect(() => {
    if (!isCreateMode) return
    setName(getDefName)
  }, [isCreateMode])

  function getDefName() {
    return `По умолчанию ${listOfTables.length + 1}`
  }

  function changeVisible() {
    setCreateMode(false)

    dispatch({
      type: Actions.Rewrite,
      payload: payload('leftVisible', !leftVisible),
    })
  }

  function onAddTable() {
    const id = TableService.createWorkTable(name)

    setCreateMode(false)

    dispatch({
      type: Actions.State,
      payload: {
        activeTable: id,
        listOfTables: [...listOfTables, { id, name }],
      },
    })

    TableService.activeTable = id
  }

  return (
    <>
      {activeTable && <LeftFloating/>}

      <Offcanvas show={leftVisible} onHide={changeVisible}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Рабочие таблицы</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={scss.wrapper}>
            <div className={scss.top}>
              {listOfTables.length
                ? (
                  <div className={scss.list}>
                    {listOfTables.map((it) => (
                      <LeftItem data={it} key={it.id}/>
                    ))}
                  </div>
                )
                : !isCreateMode && (<p>Рабочие таблицы еще не созданы...</p>)
              }

              {isCreateMode && (
                <div className={scss.create}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Имя таблицы"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    type="button"
                    className="btn btn-primary"
                    value="Добавить"
                    onClick={onAddTable}
                  />

                  <input
                    type="button"
                    className="btn btn-outline-secondary"
                    value="Отмена"
                    onClick={() => setCreateMode(false)}
                  />
                </div>
              )}
            </div>

            <div className={scss.bottom}>
              <input
                type="button"
                className="btn btn-primary"
                value="Добавить таблицу"
                disabled={isCreateMode}
                onClick={() => setCreateMode(true)}
              />

              <input
                type="button"
                className="btn btn-outline-danger"
                value="Удалить все таблицы"
                onClick={() => TableService.deleteAllTables()}
              />
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Left