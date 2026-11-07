import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import '@/config/global.jsx'
import AuthContext from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <App />
        <Toaster
          position="top-center"
          reverseOrder={true}
          toastOptions={{
            duration: 3000,
          }}
        />
      </AuthContext>
    </BrowserRouter>
  </StrictMode>,
)
