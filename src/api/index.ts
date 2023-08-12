import axios from 'axios'
import { LS_AUTH_KEY } from '@/defines'

export const createApiAxios = () => {
  const baseURL = 'http://localhost:5000/api'
  const token = window.localStorage.getItem(LS_AUTH_KEY) || ''
  const headers = { 'Authorization': 'Bearer ' + token }

  return axios.create({ baseURL, headers })
}

const $api = createApiAxios()

export default $api