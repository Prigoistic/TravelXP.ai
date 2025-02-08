import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'

const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

if (!clientId) {
  console.error('Google OAuth client ID is not configured');
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider 
      clientId={clientId}
      onScriptLoadError={() => console.error('Google Script failed to load')}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
