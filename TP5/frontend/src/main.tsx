import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ParticipantesProvider } from './context/ParticipantesContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ParticipantesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ParticipantesProvider>
  </React.StrictMode>
)
