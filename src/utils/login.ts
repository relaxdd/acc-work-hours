import md5 from 'crypto-js/md5'
import { getDateTimeWithOffset, getFormattedDateTime } from './index'

export const LS_ACCESS_KEY = '_awenn2015_wh_access'

const LS_TIME_KEY = '_awenn2015_wh_time'
// '34c5687ae683e42be4912504672c3831'
const PASSWORD_HASH = window.localStorage.getItem(LS_ACCESS_KEY) ?? 'd8578edf8458ce06fbc5bb76a58c5ca4'
const isLocalhost = window.location.hostname === 'localhost'

export function saveDateAccess() {
  const date = getFormattedDateTime()
  window.localStorage.setItem(LS_TIME_KEY, date)

  console.log(window.localStorage.getItem(LS_TIME_KEY))
}

export function setAccessPassword(password: string, cb?: () => void) {
  const msg = [
    'Пожалуйста введите новый пароль',
    'Длина пароля должна быть не меньше 16 символов',
  ]

  if (!password) {
    alert(msg[0])
    return
  }

  if (password.length < 16) {
    alert(msg[1])
    return
  }

  window.localStorage.setItem(LS_ACCESS_KEY, md5(password).toString())
  window.localStorage.removeItem(LS_TIME_KEY)

  cb && cb()
}

export function comparePassword(password: string) {
  return md5(password).toString() === PASSWORD_HASH
}

export function needEnterPass(force?: boolean): boolean {
  if (force !== undefined) return force
  // if (isLocalhost) return false

  const time = window.localStorage.getItem(LS_TIME_KEY)
  if (time === null) return true

  /** Время после которого нужно вводить пароль */
  const finish = getDateTimeWithOffset(24, time)

  if (finish > getFormattedDateTime())
    return false
  else {
    window.localStorage.removeItem(LS_TIME_KEY)
    return true
  }
}

/** @deprecated */
export function validatePass() {
  const msg = 'Введите пароль'
  return comparePassword(window.prompt(msg) ?? '')
}

/**
 * Первая версия авторизации на промпте
 * @deprecated
 */
export function needPass(cb: (() => boolean), force?: boolean) {
  if (isLocalhost && !force) return true

  const time = window.localStorage.getItem(LS_TIME_KEY)

  if (time === null) {
    if (!cb()) return false
    else {
      saveDateAccess()
      return true
    }
  } else {
    /** Время после которого нужно вводить пароль */
    const finish = getDateTimeWithOffset(24, time)

    if (finish <= getFormattedDateTime())
      return true
    else {
      window.localStorage.removeItem(LS_TIME_KEY)
      return cb()
    }
  }
}