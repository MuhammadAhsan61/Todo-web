import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

const Hero = () => {
  const { isAuth, user } = useAuth()

  return (
    <section className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-3xl text-center">

        {/* Logo */}
        <div className="w-16 h-16 rounded-[20px] bg-[#111827] flex items-center justify-center mx-auto mb-7 shadow-md">
          <Check
            size={32}
            strokeWidth={3}
            className="text-white"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight">
          Get things done.
        </h1>

        {/* Description */}
        <p className="max-w-xl mx-auto mt-5 text-base sm:text-lg text-[#6B7280] leading-7">
          Organize your tasks, stay focused, and make every day
          more productive.
        </p>

        {isAuth ? (
          <>
            <p className="mt-8 text-sm text-[#6B7280]">
              Welcome back,{' '}
              <span className="font-semibold text-[#111827]">
                {user?.name}
              </span>
            </p>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 mt-5 h-[54px] px-8 rounded-[14px] bg-[#111827] text-white text-sm font-bold hover:bg-gray-800 transition"
            >
              Go to Dashboard
              <ArrowRight size={17} />
            </Link>
          </>
        ) : (
          <>
            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

              <Link
                to="/auth/login"
                className="w-full sm:w-auto h-[54px] px-8 rounded-[14px] bg-[#111827] text-white flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-800 transition"
              >
                Login
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/auth/register"
                className="w-full sm:w-auto h-[54px] px-8 rounded-[14px] border border-[#E5E7EB] bg-white text-[#111827] flex items-center justify-center text-sm font-bold hover:bg-[#F9FAFB] transition"
              >
                Create Account
              </Link>

            </div>

            <p className="mt-7 text-sm text-[#9CA3AF]">
              Create an account to access all features.
            </p>
          </>
        )}

      </div>
    </section>
  )
}

export default Hero