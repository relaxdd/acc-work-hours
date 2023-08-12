import { useAuth } from '@/auth/AuthProvider'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedLayout() {
  const { user } = useAuth()
  return user ? <Outlet/> : <Navigate to="/"/>
}

export default ProtectedLayout