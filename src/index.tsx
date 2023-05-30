import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/index.css'
import { needEnterPass } from './utils/login'
import Auth from './temps/Auth'
import Updates from '@/temps/Updates'

(() => {
  const node = document.getElementById('app-root')
  const root = createRoot(node as HTMLElement)

  root.render(needEnterPass() ? <Auth/> : <Updates/>)
})()