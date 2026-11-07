import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const ResetPasswordOTP = () => {
  const [otp, setOtp] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Email is missing')
      navigate('/auth/reset-password')
      return
    }

    if (!otp.trim()) {
      toast.error('Please enter the OTP')
      return
    }

    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits')
      return
    }

    navigate('/auth/new-password', {
      state: {
        email,
        otp,
      },
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
          Verify OTP
        </h1>

        <p className="mt-2 text-center text-sm text-[#6B7280] leading-6">
          Enter the 6-digit OTP sent to your email.
        </p>

        <p className="mt-2 text-center text-sm font-semibold text-[#111827]">
          {email}
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#374151]">
              OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ''))
              }
              placeholder="Enter 6-digit OTP"
              className="w-full h-12 px-4 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] text-center text-lg tracking-[8px] font-bold outline-none focus:border-[#111827] transition"
            />
          </div>

          {/* Continue */}
          <button
            type="submit"
            className="w-full h-12 rounded-[12px] bg-[#111827] text-white flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-800 transition"
          >
            Continue
          </button>
        </form>

        {/* Back */}
        <div className="mt-7 text-center">
          <Link
            to="/auth/reset-password"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#374151] hover:text-[#111827] transition"
          >
            <ArrowLeft size={16} />
            Change Email
          </Link>
        </div>

      </div>
    </div>
  )
}

export default ResetPasswordOTP