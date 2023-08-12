// Версия поднимается если нужно реформатировать легаси или при больших новых фичах
// main ver + 0 + slug release + ver release
// pa = 0 | alpha = 1 | beta = 2 | cr = 3 | mr = 4
// prev = 214023

export const APP_VERSION = {
  name: '3.0.0-alpha-1',
  code: 300011,
}

export const LS_AUTH_KEY = '_wh_auth_token'
export const LS_TIME_KEY = '_awenn2015_wh_time'
export const IS_LOCALHOST = window.location.hostname === 'localhost'