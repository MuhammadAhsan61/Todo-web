import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import ResetPassword from './ResetPassword'
import VerifyOtp from './VerifyOtp'
import PageNotFound from '@/components/PageNotFound'
import ResetPasswordOTP from './ResetPasswordOTP '

const Auth = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/verify-otp' element={<VerifyOtp />} />
      <Route path="/reset-password-otp" element={<ResetPasswordOTP />}/>
      <Route path='*' element={<PageNotFound />} /> 

    </Routes>
  )
}

export default Auth