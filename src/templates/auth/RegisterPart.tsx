import { useAuthContext } from '@/templates/auth/AuthContext'
import { TypeOfForms } from '@/pages/AuthPage'

const RegisterPart = () => {
  const { onSubmit, formError } = useAuthContext()

  return (
    <form id={TypeOfForms.register} onSubmit={onSubmit}>
      <div className="mb-3">
        <label
          htmlFor="registerNicknameField"
          className="form-label"
        >Логин <span className="text-danger">*</span></label>

        <input
          type="text"
          className="form-control"
          id="registerNicknameField"
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
          htmlFor="exampleInputEmail1"
          className="form-label"
        >Email <span className="text-danger">*</span></label>

        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          name="userEmail"
          autoComplete="email"
          placeholder="example@test.org"
          aria-describedby="emailHelp"
          required
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(' ', '')
          }}
        />

        {(formError && formError.field === 'userEmail') && (
          <div className="form-text text-danger form-error">{formError.text}</div>
        )}
      </div>

      <div className="mb-3">
        <label
          htmlFor="passwordField"
          className="form-label"
        >Пароль <span className="text-danger">*</span></label>

        <input
          type="password"
          className="form-control"
          id="passwordField"
          name="userPassword"
          autoComplete="new-password"
          placeholder="your strong password"
          required
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(' ', '')
          }}
        />

        {(formError && formError.field === 'userPassword') && (
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
          name="userConfirm"
          autoComplete="new-password"
          placeholder="repeat your password"
          required
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(' ', '')
          }}
        />

        {(formError && formError.field === 'userConfirm') && (
          <div className="form-text text-danger form-error">{formError.text}</div>
        )}
      </div>
    </form>
  )
}

export default RegisterPart