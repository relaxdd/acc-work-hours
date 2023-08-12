import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/index.css'
import router from '@/router'
import { RouterProvider } from 'react-router-dom'

const node = document.getElementById('app-root')

if (node !== null) {
  createRoot(node).render(<RouterProvider router={router}/>)
}

