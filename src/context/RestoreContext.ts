import { FormErrorType } from '@/templates/auth/AuthContext'
import { createContext, useContext } from 'react'

interface IRestoreContext {
  form: { name: string, value: string }[]
  formError: FormErrorType
}

type RestoreStoreType =  [IRestoreContext, () => void]

const defRestoreContext: IRestoreContext = {
  formError: null,
  form: []
}

export const RestoreContext = createContext<RestoreStoreType>([defRestoreContext, () => ({})])
export const useRestoreContext = () => useContext(RestoreContext)