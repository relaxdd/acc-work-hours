import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LS_AUTH_KEY } from '@/defines'

export interface IUser {
  id: number,
  login: string,
  email: string,
}

interface ILogin {
  user: IUser,
  jwt: string
}

interface IAuthContext {
  user: IUser | null,
  login: (data: ILogin) => void,
  logout: () => void
}

interface IAuthProvider {
  children: ReactNode,
  userData: IUser | null
}

const defContext: IAuthContext = {
  user: null,
  login: () => {
  },
  logout: () => {
  }
}

const AuthContext = createContext<IAuthContext>(defContext)

export const AuthProvider = ({ children, userData }: IAuthProvider) => {
  const [user, setUser] = useState<IUser | null>(userData)
  const navigate = useNavigate()

  const login = (data: ILogin) => {
    console.log(data)
    setUser(data.user)
    localStorage.setItem(LS_AUTH_KEY, data.jwt)
    navigate('/table', { replace: true })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(LS_AUTH_KEY)
    navigate('/', { replace: true })
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)