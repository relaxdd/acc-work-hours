import React from 'react'
import scss from './Left.module.scss'
import { Actions, useTableContext } from '@/context/TableContext'

const LeftFloating = () => {
  const [{ visibility }, dispatch] = useTableContext()

  function changeVisible() {
    dispatch({
      type: Actions.Visible,
      payload: { key: 'left', value: !visibility.left },
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