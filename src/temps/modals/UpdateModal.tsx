import React from 'react'
import { Modal } from 'react-bootstrap'
import { Actions, useTableContext } from '@/context/TableContext'

const UpdateModal = () => {
  const [{ visibility }, dispatch] = useTableContext()

  function handleClose() {
    dispatch({
      type: Actions.Visible,
      payload: { key: 'update', value: false },
    })
  }

  return (
    <Modal
      show={visibility.update}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>Обновление</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Идет обновление локальных данных...</p>
      </Modal.Body>
    </Modal>
  )
}

export default UpdateModal