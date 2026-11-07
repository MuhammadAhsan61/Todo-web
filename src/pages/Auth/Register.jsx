import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const initialState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const Register = () => {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const {
      fullName,
      email,
      password,
      confirmPassword,
    } = state

    // Validation
    if (fullName.trim().length < 3) {
      toast.error('Please enter your full name')
      return
    }

    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }

    if (password.length < 6) {
      toast.error('Create a strong password')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    axios
      .post(`${window.apiURL}/auth/send-otp`, {
        fullName,
        email,
        password,
        role: 'Customer',
      })
      .then(({ data }) => {
        toast.success(
          data?.message || 'OTP sent successfully'
        )

        // Go to OTP verification page
        navigate('/auth/verify-otp', {
          state: {
            email,
          },
        })
      })
      .catch((error) => {
        console.error(error)

        toast.error(
          error?.response?.data?.message ||
          'Unable to send OTP'
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
          Create Account
        </h1>

        <p className="mt-2 text-center text-sm text-[#6B7280]">
          Create your account and start managing your todos.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Full Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#374151]">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={state.fullName}
              placeholder="Enter your full name"
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] outline-none focus:border-[#111827] transition"
            />
          </div>

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
                placeholder="Create a password"
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] outline-none focus:border-[#111827] transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
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

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#374151]">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={state.confirmPassword}
                placeholder="Confirm your password"
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] outline-none focus:border-[#111827] transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-[12px] bg-[#111827] text-white flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={17} />
              </>
            )}
          </button>

        </form>

        {/* Login */}
        <p className="mt-7 text-center text-sm text-[#6B7280]">
          Already have an account?{' '}

          <Link
            to="/auth/login"
            className="font-semibold text-[#111827] hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register