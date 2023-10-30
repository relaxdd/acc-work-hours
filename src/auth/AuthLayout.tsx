import { Await, useLoaderData, useOutlet } from 'react-router-dom'
import { AuthProvider, IUser } from '@/auth/AuthProvider'
import { Suspense } from 'react'
import { Alert, Spinner } from 'react-bootstrap'

const Fallback = () => (
  <div
    style={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <Spinner variant="primary" animation="border"/>
  </div>
)

const AuthLayout = () => {
  const outlet = useOutlet()
  const { userPromise } = useLoaderData() as { userPromise: Promise<IUser | null> }

  return (
    <Suspense fallback={<Fallback/>}>
      <Await
        resolve={userPromise}
        errorElement={<Alert variant="danger">Something went wrong!</Alert>}
        children={(user) => (
          <AuthProvider userData={user}>{outlet}</AuthProvider>
        )}
      />
    </Suspense>
  )
}

export default AuthLayout