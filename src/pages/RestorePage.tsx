import { FormEvent, useState } from 'react'
import { Modal } from 'react-bootstrap'
import axios, { AxiosError } from 'axios'
import { FormErrorType } from '@/templates/auth/AuthContext'

const formId = 'restoreForm'

function RestorePage() {
  const [login, setLogin] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [formError, setError] = useState<FormErrorType>(null)

  async function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      const url = 'http://localhost:5000/api/auth/restore?login=' + login
      const resp = await axios.get(url)

      alert(resp.data?.message)
      setLogin('')
    } catch (e) {
      console.error(e)

      const err = e as AxiosError<{ error: string, fields?: string[] }>
      const data = err?.response?.data

      if (!data || (err?.response?.status || 500) >= 500) {
        alert('Во время запроса произошла ошибка!')
        console.error(data?.error || err.response)
        return
      }

      if (!data?.fields || data.fields.length > 1) {
        alert(data.error)
        return
      }

      setError({ field: data?.fields[0]!, text: data.error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show centered backdrop="static">
      <Modal.Header>
        <h1 className="modal-title fs-5" id="authModalLabel">Восстановление</h1>
      </Modal.Header>

      <Modal.Body>
        <form id={formId} onSubmit={onSubmitHandler}>
          <div>
            <label
              htmlFor="loginField"
              className="form-label"
            >Логин <span className="text-danger">*</span></label>

            <input
              type="text"
              className="form-control"
              id="loginField"
              name="login"
              autoComplete="nickname"
              placeholder="user123"
              required
              value={login}
              onChange={({ target }) => setLogin(target.value.replace(' ', ''))}
            />

            {(formError && formError.field === 'login') && (
              <div className="form-text text-danger form-error">{formError.text}</div>
            )}
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <input
          type="submit"
          className="btn btn-primary"
          form={formId}
          value={isLoading ? 'Отправка...' : 'Отправить'}
          disabled={isLoading}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default RestorePage