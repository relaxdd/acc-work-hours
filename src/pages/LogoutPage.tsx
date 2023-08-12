import React from 'react'
import { Navigate } from 'react-router-dom'
import { LS_AUTH_KEY } from '@/defines'

function LogoutPage() {
  window.localStorage.removeItem(LS_AUTH_KEY)
  return <Navigate to="/" />
}

export default LogoutPage