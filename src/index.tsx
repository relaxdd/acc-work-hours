import React from 'react'
import { createRoot } from 'react-dom/client'
import App from "./temps/App"
import "bootstrap/dist/css/bootstrap.min.css"
import './assets/styles/index.css'
import { needPass, validatePass } from "./utils/login"

if (needPass(validatePass)) {
  const root = createRoot(
    document.getElementById('root') as HTMLElement,
  )

  root.render(<App />)
}
