import React, { useEffect, useState } from 'react'
import { setAccessPassword, updateAppSetting } from '@/utils/login'
import { useTableContext } from '@/context/TableContext'

const SettingFields = () => {
  const [{ settings, visibility }] = useTableContext()

  const [password, setPassword] = useState('')
  const [isDisabled, setDisabled] = useState(settings.isDisabled)

  useEffect(() => {
    if (!visibility.setting) return
    setTimeout(() => setPassword(''), 1000)
  }, [visibility.setting])

  function updateAccessPassword() {
    setAccessPassword(password, () => {
      window.location.reload()
    })
  }

  function changePasswordSetting() {
    setDisabled(prev => !prev)
    updateAppSetting('isDisabled', !isDisabled)
  }

  return (
    <>
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
            readOnly={isDisabled}
          />

          <input
            type="button"
            className="btn btn-primary"
            value="Сохранить"
            disabled={isDisabled}
            onClick={updateAccessPassword}
          />
        </div>
      </div>

      <div className="form-check form-check-inline mt-3">
        <input
          type="checkbox"
          className="form-check-input"
          checked={isDisabled}
          onChange={changePasswordSetting}
        />
        <label>Отключить</label>
      </div>
    </>
  )
}

export default SettingFields