import axios from 'axios'
import { LS_AUTH_KEY } from '@/defines'

export const getAuthorization = (token: string | null = null) => {
  token ??= window.localStorage.getItem(LS_AUTH_KEY) ?? ''
  return { 'Authorization': 'Bearer ' + (token ?? '') }
}

export const createApiAxios = () => {
  const baseURL = 'http://localhost:5000/api'
  const headers = getAuthorization()

  return axios.create({ baseURL, headers })
}

const $api = createApiAxios()

export default $api