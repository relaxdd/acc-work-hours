import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/index.css'
import App from '@/temps/App'

const node = document.getElementById('app-root')
if (node !== null) createRoot(node).render(<App/>)

