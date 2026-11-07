import React from 'react'
import { Link } from 'react-router-dom'
import { Check, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const Header = () => {
  const { isAuth, user, handleLogout } = useAuth()

  return (
    <header className="bg-white border-b border-[#E5E7EB]">
      <nav className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[#111827] flex items-center justify-center">
            <Check
              size={21}
              strokeWidth={3}
              className="text-white"
            />
          </div>

          <span className="text-xl font-extrabold text-[#111827]">
            My Todos
          </span>
        </Link>

        {/* Auth */}
        {isAuth ? (
          <div className="flex items-center gap-4">

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <User
                  size={18}
                  className="text-[#374151]"
                />
              </div>

              <span className="hidden sm:block text-sm font-semibold text-[#111827]">
                {user?.name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="h-10 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[#374151] flex items-center gap-2 text-sm font-semibold hover:bg-[#F9FAFB] transition"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        ) : (
          <div className="flex items-center gap-5">

            <Link
              to="/auth/login"
              className="text-sm font-semibold text-[#374151] hover:text-[#111827] transition"
            >
              Login
            </Link>

            <Link
              to="/auth/register"
              className="h-10 px-5 rounded-[12px] bg-[#111827] text-white flex items-center justify-center text-sm font-bold hover:bg-gray-800 transition"
            >
              Create Account
            </Link>

          </div>
        )}

      </nav>
    </header>
  )
}

export default Header
