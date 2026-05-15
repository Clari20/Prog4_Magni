import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ParticipantesProvider } from './context/ParticipantesContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ParticipantesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ParticipantesProvider>
    </AuthProvider>
  </React.StrictMode>
)
