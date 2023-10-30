import { FormEvent, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import axios, { AxiosError } from 'axios'
import { FormErrorType } from '@/templates/auth/AuthContext'
import FormData from 'form-data'
import { formToJson } from '@/utils'
import { NavLink, useHref, useLocation } from 'react-router-dom'

const formId = 'restoreForm'

function StepOne({ formError }: { formError: FormErrorType }) {
  return (
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
        onInput={({ currentTarget }) => {
          currentTarget.value = currentTarget.value.replace(' ', '')
        }}
      />

      {(formError && formError.field === 'login') && (
        <div className="form-text text-danger form-error">{formError.text}</div>
      )}
    </div>
  )
}

function StepTwo({ formError }: { formError: FormErrorType }) {
  return (
    <>
      <div className="mb-3">
        <label
          htmlFor="passwordField"
          className="form-label"
        >Пароль <span className="text-danger">*</span></label>

        <input
          type="password"
          className="form-control"
          id="passwordField"
          name="password"
          autoComplete="new-password"
          placeholder="your strong password"
          required
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(' ', '')
          }}
        />

        {(formError && formError.field === 'password') && (
          <div className="form-text text-danger form-error">{formError.text}</div>
        )}
      </div>

      <div className="mb-3">
        <label
          htmlFor="confirmField"
          className="form-label"
        >Еще раз <span className="text-danger">*</span></label>

        <input
          type="password"
          className="form-control"
          id="confirmField"
          name="confirm"
          autoComplete="new-password"
          placeholder="repeat your password"
          required
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(' ', '')
          }}
        />

        {(formError && formError.field === 'confirm') && (
          <div className="form-text text-danger form-error">{formError.text}</div>
        )}
      </div>

      <NavLink to="/restore">Назад на первый этап</NavLink>
    </>
  )
}

function RestorePage() {
  const [isLoading, setLoading] = useState(false)
  const [formError, setError] = useState<FormErrorType>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const location = useLocation()
  const token = (new URLSearchParams(location.search)).get('token')

  async function sendFirstStep(form: FormData) {
    // @ts-ignore
    const url = 'http://localhost:5000/api/auth/restore?login=' + form.get('login')
    return await axios.get(url)
  }

  async function sendSecondStep(form: FormData) {
    const data = formToJson(form)
    const url = 'http://localhost:5000/api/auth/password'
    const headers = { 'Authorization': 'Bearer ' + token }

    return await axios.post(url, data, { headers })
  }

  async function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)

    try {
      const resp = await (token ? sendSecondStep(form) : sendFirstStep(form))

      alert(resp.data?.message)
      formRef.current!.reset()

      // if (token) window.location.reload()
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
        <form id={formId} onSubmit={onSubmitHandler} ref={formRef}>
          {token
            ? <StepTwo formError={formError}/>
            : <StepOne formError={formError}/>
          }
        </form>
      </Modal.Body>

      <Modal.Footer>
        <NavLink to="/auth" className="btn btn-secondary">Назад</NavLink>

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