import { FormEvent, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import LoginPart from '@/templates/auth/LoginPart'
import RegisterPart from '@/templates/auth/RegisterPart'
import { AuthContext, FormErrorType } from '@/templates/auth/AuthContext'
import FormData from 'form-data'
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { IUser, useAuth } from '@/auth/AuthProvider'

export const enum TypeOfForms {
  login = 'loginForm',
  register = 'registerForm'
}

interface ILoginResp {
  message: string,
  jwt: string,
  user: IUser
}

const options: Record<TypeOfForms, { url: string }> = {
  [TypeOfForms.login]: {
    url: 'http://localhost:5000/api/auth/signin'
  },
  [TypeOfForms.register]: {
    url: 'http://localhost:5000/api/auth/signup'
  }
}

const fieldMap = {
  [TypeOfForms.login]: [
    { client: 'userLogin', server: 'login' },
    { client: 'userPassword', server: 'password' },
  ],
  [TypeOfForms.register]: [
    { client: 'userLogin', server: 'login' },
    { client: 'userEmail', server: 'email' },
    { client: 'userPassword', server: 'password' },
    { client: 'userConfirm', server: 'confirm' }
  ]
}

function AuthPage() {
  const [activeForm, setActiveForm] = useState<TypeOfForms>(TypeOfForms.login)
  const [formError, setError] = useState<FormErrorType>(null)
  const [isLoading, setLoading] = useState(false)
  // hooks
  const navigate = useNavigate()
  const { login } = useAuth()

  // ***************

  const submitProps = useMemo(() => {
    return isLoading
      ? {
        value: 'Отправка...',
        disabled: true,
        style: { opacity: '.7', cursor: 'progress' }
      }
      : { value: 'Отправить' }
  }, [isLoading])

  // ***************

  async function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const info = options?.[e.currentTarget.id as TypeOfForms]

    if (!info) {
      alert('Не указаны параметры формы!')
      return
    }

    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const json = fieldMap[activeForm].reduce<Record<string, string>>((acc, it) => {
      // @ts-ignore
      acc[it.server] = form.get(it.client)
      return acc
    }, {})

    try {
      const { data } = await axios.post<ILoginResp>(info.url, json)
      login({ user: data.user, jwt: data.jwt })
    } catch (e) {
      const err = e as AxiosError<{ error: string, fields: string[] }>
      const data = err.response?.data

      if (!data || (err?.response?.status || 500) >= 500) {
        alert('Во время запроса произошла ошибка!')
        console.error(data?.error || err.response)
        return
      }

      if (!data?.fields || data.fields.length > 1) {
        alert(data.error)
        return
      }

      setError({ text: data.error, field: fieldMap[activeForm].find(it => it.server === data.fields[0])?.client! })
    } finally {
      setLoading(false)
    }
  }

  function changeActiveForm(form: TypeOfForms) {
    document.querySelectorAll<HTMLInputElement>(`${form} input`).forEach(($it) => {
      $it.value = ''
    })

    setActiveForm(form)
  }

  function getBtnClass(form: TypeOfForms, name: string) {
    return activeForm === form ? `btn-${name}` : `btn-outline-${name}`
  }

  return (
    <Modal show centered backdrop="static">
      <Modal.Header>
        <h1 className="modal-title fs-5" id="authModalLabel">Аутентификация</h1>
        <img src="/images/lock-1.svg" alt="lock-alt" style={{ height: '25px' }}/>
      </Modal.Header>

      <AuthContext.Provider value={{ formError, onSubmit: onSubmitHandler }}>
        <Modal.Body>
          <div className="btn-group w-100 mb-4" role="group" aria-label="Large button group">
            <input
              type="button"
              className={`btn ${getBtnClass(TypeOfForms.login, 'primary')}`}
              value="Авторизация"
              data-tab="#loginForm"
              onClick={() => {
                changeActiveForm(TypeOfForms.login)
              }}
            />

            <input
              type="button"
              className={`btn ${getBtnClass(TypeOfForms.register, 'secondary')}`}
              value="Регистрация"
              data-tab="#registerForm"
              onClick={() => {
                changeActiveForm(TypeOfForms.register)
              }}
            />
          </div>

          <div id="authFormsWrapper">
            {activeForm === TypeOfForms.login && <LoginPart/>}
            {activeForm === TypeOfForms.register && <RegisterPart/>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <input
            type="button"
            value="На главную"
            className="btn btn-secondary"
            onClick={() => {
              navigate('/')
            }}
          />

          <input
            type="submit"
            className="btn btn-primary"
            form={activeForm}
            {...submitProps}
          />
        </Modal.Footer>
      </AuthContext.Provider>
    </Modal>
  )
}

export default AuthPage