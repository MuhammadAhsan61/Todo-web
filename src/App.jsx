import './App.css'
import React from 'react'
import Index from './pages/Routes'
import { useAuth } from './context/AuthContext'

const App = () => {
  const { isAppLoading } = useAuth()

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#111827] flex items-center justify-center">
            <span className="text-white text-2xl font-bold">✓</span>
          </div>

          <div className="w-6 h-6 border-2 border-[#E5E7EB] border-t-[#111827] rounded-full animate-spin" />

          <p className="text-sm text-[#6B7280]">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return <Index />
}

export default App
