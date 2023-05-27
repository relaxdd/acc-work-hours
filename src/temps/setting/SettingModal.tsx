import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Actions, defTableContext, ITableOptions, useTableContext } from 'context/TableContext'
import { setAccessPassword } from '../../utils/login'
import { BaseDispatch } from '../../types'
import { LS_OPTION_KEY } from '../../data'

const SettingModal = () => {
  const [{ settingVisible, options }, dispatch, payload] = useTableContext()
  const [password, setPassword] = useState('')

  const changeOptionsField: BaseDispatch<ITableOptions> = (key, value) => {
    const data = {
      ...options, [key]: value
      || defTableContext.options[key as keyof ITableOptions]!,
    }

    dispatch({
      type: Actions.Rewrite,
      payload: payload('options', data),
    })

    localStorage.setItem(LS_OPTION_KEY, JSON.stringify(data))
  }

  function updateAccessPassword() {
    setAccessPassword(password, () => {
      // setPassword('')
      window.location.reload()
    })
  }

  function handleClose() {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('settingVisible', false),
    })
  }

  useEffect(() => {
    if (!settingVisible) return
    setTimeout(() => setPassword(''), 1000)
  }, [settingVisible])

  // useEffect(() => {
  //   if (pa) return
  //   setPassword('')
  // }, [password])

  return (
    <Modal
      show={settingVisible}
      onHide={handleClose}
      centered
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>Настройки приложения</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="dtRoundStep">Шаг округления даты</label>

          <select
            id="dtRoundStep"
            className="form-select mt-2"
            value={options.dtRoundStep}
            onChange={({ target }) => changeOptionsField('dtRoundStep', +target.value)}
          >
            <option value="5">5 Минут</option>
            <option value="10">10 Минут</option>
            <option value="15">15 Минут</option>
          </select>
        </div>

        <div>
          <label htmlFor="new-password">Новый пароль для входа</label>

          <div className="d-flex align-items-end gap-2">
            <input
              type="password"
              id="new-password"
              className="form-control mt-2"
              autoComplete="none"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            <input
              type="button"
              className="btn btn-primary"
              value="Сохранить"
              onClick={updateAccessPassword}
            />
          </div>
        </div>
      </Modal.Body>

      {/* <Modal.Footer></Modal.Footer> */}
    </Modal>
  )
}

export default SettingModal