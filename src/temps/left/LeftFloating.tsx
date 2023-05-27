import React from 'react'
import scss from './Left.module.scss'
import { Actions, useTableContext } from 'context/TableContext'

const LeftFloating = () => {
  const [{ leftVisible }, dispatch, payload] = useTableContext()

  function changeVisible() {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('leftVisible', !leftVisible),
    })
  }

  return (
    <div className={scss.floating}>
      <input
        type="button"
        className="btn btn-warning"
        value="T"
        onClick={changeVisible}
      />
    </div>
  )
}

export default LeftFloating