import React, { FormEvent, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { comparePassword, saveDateAccess } from '../utils/login'

const Auth = () => {
  const [value, setValue] = useState('')
  const [isError, setError] = useState(false)

  function verifyPassword(e: FormEvent) {
    e.preventDefault()

    setError(false)

    if (!comparePassword(value))
      setError(true)
    else {
      // Поменять на что-то более разумное
      saveDateAccess()
      window.location.reload()
    }
  }


  return (
    <Modal
      show={true}
    >
      <Modal.Header>
        <Modal.Title>Введите пароль</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form id="auth-form" onSubmit={verifyPassword}>
          <input
            type="password"
            className="form-control"
            placeholder="О чего же стоишь земля..."
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />

          {isError && (
            <p className="text-danger mt-2 mb-0">Введен неверный пароль!</p>
          )}
        </form>
      </Modal.Body>

      <Modal.Footer>
        <input
          type="submit"
          form="auth-form"
          value="Дальше"
          className="btn btn-primary"
        />
      </Modal.Footer>
    </Modal>
  )
}

export default Auth