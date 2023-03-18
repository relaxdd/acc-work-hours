import md5 from "crypto-js/md5"
import { getDateTimeWithOffset, getFormattedDateTime } from "./index"

const PASSWORD_HASH = '34c5687ae683e42be4912504672c3831'
const LS_KEY = '_awenn2015_wh_time'
const isLocalhost = window.location.hostname === 'localhost'

function savePass() {
  const date = getFormattedDateTime()
  localStorage.setItem(LS_KEY, date)
}

export function validatePass() {
  const msg = "Введите пароль"
  return md5(window.prompt(msg) ?? "").toString() === PASSWORD_HASH
}

export function needPass(cb: (() => boolean)) {
  if (isLocalhost) return true

  const check = localStorage.getItem(LS_KEY)

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
      localStorage.removeItem(LS_KEY)
      return cb()
    }
  }
}