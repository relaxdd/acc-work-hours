import { useAuthContext } from '@/templates/auth/AuthContext'
import { TypeOfForms } from '@/pages/AuthPage'

const LoginPart = () => {
  const { onSubmit, formError } = useAuthContext()

  return (
    <form id={TypeOfForms.login} onSubmit={onSubmit}>
      <div className="mb-3">
        <label
          htmlFor="loginNicknameField"
          className="form-label"
        >Логин <span className="text-danger">*</span></label>

        <input
          type="text"
          className="form-control"
          id="loginNicknameField"
          name="userLogin"
          autoComplete="nickname"
          placeholder="user123"
          required
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(' ', '')
          }}
        />

        {(formError && formError.field === 'userLogin') && (
          <div className="form-text text-danger form-error">{formError.text}</div>
        )}
      </div>

      <div className="mb-3">
        <label
          htmlFor="loginPasswordField"
          className="form-label"
        >Пароль <span className="text-danger">*</span></label>

        <input
          id="loginPasswordField"
          className="form-control"
          type="password"
          name="userPassword"
          autoComplete="current-password"
          placeholder="your password"
          required
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(' ', '')
          }}
        />

        {(formError && formError.field === 'userPassword') && (
          <div className="form-text text-danger form-error">{formError.text}</div>
        )}
      </div>

      <div id="emailHelp" className="form-text"><a href="/restore">Забыли пароль?</a></div>
    </form>
  )
}

export default LoginPart