import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Actions, defModalVisible, useTableContext } from '@/context/TableContext'

const DescrModal = () => {
  const [{ modalVisible, filteredTable }, dispatch, payload] = useTableContext()
  const [descr, setDescr] = useState(getDefDescription)

  useEffect(() => {
    if (modalVisible.visible)
      setDescr(getDefDescription)
    else
      setDescr(prev => prev.trim())
  }, [modalVisible])

  function getDefDescription() {
    return filteredTable.find(it => it.id === modalVisible.id)?.description || ''
  }

  function handleClose() {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('modalVisible', defModalVisible),
    })
  }

  function saveDescription() {
    dispatch({
      type: Actions.WH_Item,
      payload: {
        key: 'description',
        id: modalVisible.id!,
        value: descr.trim(),
      },
    })

    handleClose()
  }

  return (
    <Modal
      show={modalVisible.visible}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Описание задачи</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          className="form-control"
          rows={8}
          value={descr}
          placeholder="Опишите суть вашей задачи что бы потом можно было что то с этим сделать..."
          onChange={({ target }) => setDescr(target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <input
          type="button"
          className="btn btn-secondary"
          value="Отмена"
          onClick={handleClose}
        />

        <input
          type="button"
          className="btn btn-primary"
          value="Сохранить"
          onClick={saveDescription}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default DescrModal