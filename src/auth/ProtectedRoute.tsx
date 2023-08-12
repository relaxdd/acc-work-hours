import { useAuth } from '@/auth/AuthProvider'
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/"/>
  return children
}

export default ProtectedRoute