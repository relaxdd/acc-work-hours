import React, { ReactElement } from 'react'
import { Actions, useTableContext } from '@/context/TableContext'

function Empty(): ReactElement {
  const [, dispatch, payload] = useTableContext()

  function openLeft() {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('leftVisible', true),
    })
  }

  return (
    <div>
      <h5 style={{ marginBottom: '15px' }}>
        Приветствую тебя друг, что бы начать работу нужно первую создать таблицу!
      </h5>
      <button className="btn btn-primary" onClick={openLeft}>Создать таблицу</button>
    </div>
  )
}

export default Empty