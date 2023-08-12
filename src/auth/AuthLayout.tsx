import { Await, useLoaderData, useOutlet } from 'react-router-dom'
import { AuthProvider, IUser } from '@/auth/AuthProvider'
import { Suspense } from 'react'
import { Alert, Spinner } from 'react-bootstrap'

const AuthLayout = () => {
  const outlet = useOutlet()
  const { userPromise } = useLoaderData() as { userPromise: Promise<IUser | null> }

  return (
    <Suspense fallback={<Spinner variant="primary" animation="border"/>}>
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