import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const initialState = {
  email: '',
}

const ResetPassword = () => {
const navigate = useNavigate()

  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { email } = state

    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }

    setLoading(true)

    axios
      .post(`${window.apiURL}/auth/reset-password/send-otp`, {
        email,
      })
      .then(({ data }) => {
        toast.success(
          data?.message || 'Password reset email sent successfully'
        )
        navigate('/auth/reset-password-otp', {
          state: { email },
        })
      })
      .catch((error) => {
        console.error(error)

        toast.error(
          error?.response?.data?.message ||
          'Unable to send reset email'
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
          Reset Password
        </h1>

        <p className="mt-2 text-center text-sm text-[#6B7280] leading-6">
          Enter your email address and we'll send you instructions
          to reset your password.
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

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
              />

              <input
                type="email"
                name="email"
                value={state.email}
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] outline-none focus:border-[#111827] transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-[12px] bg-[#111827] text-white flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Reset Email
                <Mail size={17} />
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-7 text-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#374151] hover:text-[#111827] transition"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  )
}

export default ResetPassword