import md5 from 'crypto-js/md5'
import { getDateTimeWithOffset, getFormattedDateTime } from './index'

export const LS_ACCESS_KEY = '_awenn2015_wh_access'

const LS_TIME_KEY = '_awenn2015_wh_time'
const PASSWORD_HASH = window.localStorage.getItem(LS_ACCESS_KEY) ?? '34c5687ae683e42be4912504672c3831'
const isLocalhost = window.location.hostname === 'localhost'

function savePass() {
  const date = getFormattedDateTime()
  window.localStorage.setItem(LS_TIME_KEY, date)
}

export function setAccessPassword(password: string) {
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

  window.location.reload()
}

export function validatePass() {
  const msg = 'Введите пароль'
  return md5(window.prompt(msg) ?? '').toString() === PASSWORD_HASH
}

export function needPass(cb: (() => boolean)) {
  if (isLocalhost) return true

  const check = window.localStorage.getItem(LS_TIME_KEY)

  if (check === null) {
    if (!cb()) return false
    else {
      savePass()
      return true
    }
  } else {
    const finish = getDateTimeWithOffset(24, check)
    if (finish > getFormattedDateTime())
      return true
    else {
      window.localStorage.removeItem(LS_TIME_KEY)
      return cb()
    }
  }
}