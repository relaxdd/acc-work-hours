import React, { useState } from 'react'
import { Offcanvas } from 'react-bootstrap'
import LeftButton from './LeftButton'
import { Actions, useTableContext } from '../../context/TableContext'
import scss from './Left.module.scss'

function getWorkTables() {

}

const demoListOfWT = [
  {
    name: 'Table 1',
    datetime: 'qwerty',
  },
  {
    name: 'Table 2',
    datetime: 'qwerty',
  },
  {
    name: 'Table 3',
    datetime: 'qwerty',
  },

]

const Left = () => {
  const [{ leftVisible }, dispatch] = useTableContext()
  const [isCreate, setCreate] = useState(false)

  function changeVisible() {
    dispatch({
      type: Actions.Rewrite,
      payload: { key: 'leftVisible', value: !leftVisible },
    })
  }

  return (
    <>
      <LeftButton />

      <Offcanvas show={leftVisible} onHide={changeVisible}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Рабочие таблицы</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={scss.wrapper}>
            <div>
              {demoListOfWT.map((it, i) => (
                <p className={scss.item} key={i}>{it.name}</p>
              ))}

              {isCreate && (
                <div className="d-flex" style={{ columnGap: '10px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Имя таблицы"
                  />

                  <input
                    type="button"
                    className="btn btn-primary"
                    value="Добавить"
                  />

                  <input
                    type="button"
                    className="btn btn-outline-secondary"
                    value="Отмена"
                    onClick={() => setCreate(false)}
                  />
                </div>

              )}
            </div>

            <div>
              <input
                type="button"
                className="btn btn-primary"
                value="Создать"
                onClick={() => setCreate(true)}
              />
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Left