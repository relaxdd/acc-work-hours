import React from 'react'
import scss from './Left.module.scss'

const LeftCreate = () => {
  return (
    <div className={scss.create}>
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
  )
}

export default LeftCreate