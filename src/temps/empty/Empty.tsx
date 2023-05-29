import React, { ReactElement, useState } from 'react'
import { Actions, useTableContext } from '@/context/TableContext'
import caret from '@svg/caret-down-big.svg'
import scss from './Empty.module.scss'

function Empty(): ReactElement {
  const [, dispatch, payload] = useTableContext()
  const [isVisible, setVisible] = useState(false)

  function openLeft() {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('leftVisible', true),
    })
  }

  return (
    <div className={isVisible ? scss.active : ''}>
      <h5 className={scss.title}>
        Приветствую тебя друг, что бы начать работу нужно первую создать таблицу!
      </h5>

      <div className={scss.details}>
        <p className="small m-0">Если ты не понимаешь что это за сайт и для чего он нужен то кликни сюда</p>

        <button type="button" className="btn btn-xs btn-warning" onClick={() => setVisible(prev => !prev)}>
          <img src={caret} alt="caret-icon" className={scss.icon}/>
        </button>
      </div>

      <div className={scss.hidden}>
        <ul className={scss.list}>
          <li>Этот сайт нужен для создания рабочих таблиц</li>
          <li>Рабочие таблицы это структуры в которые можно заносить данные о выполненных микро-задачах</li>
          <li>У каждой задачи в таблице может быть привязка к сущности (например отрасль работы с конкретной ставкой в час)</li>
          <li>Сущности можно добавить в настройках, там же редактируются все параметры таблицы</li>
          <li>По итогу все задачи подсчитываются и выводится итоговая стоимость работы внизу таблицы</li>
        </ul>
      </div>

      <button
        className="btn btn-primary"
        style={{marginTop: '20px'}}
        onClick={openLeft}
      >Создать таблицу</button>
    </div>
  )
}

export default Empty