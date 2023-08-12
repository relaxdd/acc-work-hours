import { createContext, useContext } from 'react'

export type FormErrorType = { field: string, text: string } | null

interface IAuthContext {
  formError: FormErrorType,
  onSubmit: (e: any) => void
}

const defContext: IAuthContext = {
  formError: null,
  onSubmit: () => ({})
}

export const AuthContext = createContext<IAuthContext>(defContext)
export const useAuthContext = () => useContext(AuthContext)