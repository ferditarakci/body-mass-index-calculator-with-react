import React from 'react'
import { createRoot } from 'react-dom/client'
import './assets/scss/style.scss'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
