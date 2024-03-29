import React from 'react'
import { Modal } from 'react-bootstrap'
import { Actions, useTableContext } from '@/context/TableContext'
import scss from './HelpModal.module.scss'

const list = [
  'Что бы отредактировать данные добавленной строки в таблице кликните два раза по ячейке',
  `Редактируемые ячейки: 'Начал', 'Закончил', 'Сущность', 'Отплачено', 'Описание'`,
  `Для того что бы манипулировать со строкой (переместить или удалить) используйте клавиши забитые в настройках, по умолчанию это 'Delete', 'ArrowUp' и 'ArrowDown'`,
  'Если у вас появились какие-то другие вопросы по работе сайта пишите на почту <a href="mailto:awenn2015@gmail.com" target="_blank">awenn2015@gmail.com</a> или в  <a href="https://t.me/awenn2021" target="_blank" >Telegram</a>'
]

const HelpModal = () => {
  const [{ visibility }, dispatch] = useTableContext()

  function handleClose() {
    dispatch({
      type: Actions.Visible,
      payload: { key: 'help', value: false },
    })
  }

  return (
    <Modal
      show={visibility.help}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Помощь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className={scss.list}>
          {list.map((it, i) => (
            <li className={scss.item} key={i} dangerouslySetInnerHTML={{ __html: it }}/>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  )
}

export default HelpModal