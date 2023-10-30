import { createBrowserRouter, defer } from 'react-router-dom'
import IndexPage from '@/pages/IndexPage'
import AuthPage from '@/pages/AuthPage'
import ErrorPage from '@/pages/ErrorPage'
import MainPage from '@/pages/MainPage'
import ProtectedLayout from '@/auth/ProtectedLayout'
import AuthLayout from '@/auth/AuthLayout'
import axios from 'axios'
import { IUser } from '@/auth/AuthProvider'
import LogoutPage from '@/pages/LogoutPage'
import ProfilePage from '@/pages/ProfilePage'
import { LS_AUTH_KEY } from '@/defines'
import RestorePage from '@/pages/RestorePage'
import { getAuthorization } from '@/api'

interface ValidateResp {
  message: string,
  user: IUser
}

async function loadUserData() {
  const token = window.localStorage.getItem(LS_AUTH_KEY)
  if (!token) return null

  const url = 'http://localhost:5000/api/auth/validate'
  const params = { headers: getAuthorization(token) }

  try {
    const resp = await axios.get<ValidateResp>(url, params)
    return resp?.data?.user || null
  } catch (e) {
    console.error(e)
    return null
  }
}

const router = createBrowserRouter([
  {
    path: '/logout',
    element: <LogoutPage/>,
  },
  {
    path: '/restore',
    element: <RestorePage/>,
  },
  {
    element: <AuthLayout/>,
    errorElement: <ErrorPage/>,
    loader: () => defer({ userPromise: loadUserData() }),
    children: [
      {
        path: '/',
        element: <IndexPage/>,
      },
      {
        path: '/auth',
        element: <AuthPage/>,
      },
      {
        element: <ProtectedLayout/>,
        children: [
          {
            path: '/table',
            element: <MainPage/>
          },
          {
            path: '/profile',
            element: <ProfilePage/>
          }
        ]
      }
    ]
  },
])

export default router