import React from 'react'
import scss from './Left.module.scss'
import { Actions, useTableContext } from '../../context/TableContext'

const LeftButton = () => {
  const [{ leftVisible }, dispatch] = useTableContext()

  function changeVisible() {
    dispatch({
      type: Actions.Rewrite,
      payload: { key: 'leftVisible', value: !leftVisible },
    })
  }

  return (
    <div className={scss.button}>
      <input
        type="button"
        className="btn btn-warning"
        value="T"
        style={{ fontWeight: '500' }}
        onClick={changeVisible}
      />
    </div>
  )
}

export default LeftButton