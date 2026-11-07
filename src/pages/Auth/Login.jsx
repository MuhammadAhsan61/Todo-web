import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const initialState = {
  email: '',
  password: '',
}

const Login = () => {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { readProfile } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { email, password } = state

    if (!email || !password) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)

    axios
      .post(`${window.apiURL}/auth/login`, {
        email,
        password,
      })
      .then(({ data }) => {
        const { token } = data

        localStorage.setItem('jwt', token)

        return readProfile(token)
      })
      .then(() => {
        toast.success('Login successful')
        navigate('/dashboard')
      })
      .catch((error) => {
        console.error(error)

        toast.error(
          error?.response?.data?.message ||
          'Invalid email or password'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="w-14 h-14 rounded-[18px] bg-[#111827] flex items-center justify-center mx-auto mb-6">
          <Check
            size={28}
            strokeWidth={3}
            className="text-white"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[#111827] text-center">
          Welcome back
        </h1>

        <p className="mt-2 text-center text-sm text-[#6B7280]">
          Login to manage your todos.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#374151]">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={state.email}
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] outline-none focus:border-[#111827] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#374151]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={state.password}
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] outline-none focus:border-[#111827] transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/auth/reset-password"
              className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-[12px] bg-[#111827] text-white flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight size={17} />
              </>
            )}
          </button>

        </form>

        {/* Register */}
        <p className="mt-7 text-center text-sm text-[#6B7280]">
          Don't have an account?{' '}

          <Link
            to="/auth/register"
            className="font-semibold text-[#111827] hover:underline"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login