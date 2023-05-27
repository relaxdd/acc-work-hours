import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './temps/App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/index.css'
import { needEnterPass } from './utils/login'
import Auth from './Auth'

(() => {
  const node = document.getElementById('app-root')
  const root = createRoot(node as HTMLElement)

  root.render(needEnterPass() ? <Auth/> : <App/>)
})()