import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    User,
    Mail,
    Lock,
    LogOut,
    Save
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [form, setForm] = useState({
        fullName: '',
        email: ''
    })

    // Get User
    useEffect(() => {
        const token = localStorage.getItem('jwt')

        if (!token) {
            setIsLoading(false)
            return
        }

        axios.get(
            `${window.apiURL}/auth/user`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((response) => {
                const userData = response.data.user

                setUser(userData)

                setForm({
                    fullName: userData?.fullName || '',
                    email: userData?.email || ''
                })
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to get user information'
                )
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('jwt')

        toast.success('Logged out successfully')

        navigate('/auth/login', {
            replace: true
        })
    }

    return (
        <div className='w-full min-w-0'>

            {/* Header */}
            <div className='mb-5 sm:mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 sm:text-2xl'>
                    Settings
                </h2>

                <p className='mt-1 text-xs text-gray-500 sm:text-sm'>
                    Manage your account settings.
                </p>
            </div>

            {isLoading ? (

                <div className='flex min-h-[180px] w-full items-center justify-center rounded-xl border border-gray-200 bg-white'>
                    <p className='text-sm text-gray-500'>
                        Loading settings...
                    </p>
                </div>

            ) : (

                <div className='w-full max-w-2xl space-y-4'>

                    {/* Account Information */}
                    <div className='rounded-xl border border-gray-200 bg-white p-4 sm:p-6'>

                        <div className='mb-5 flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100'>
                                <User
                                    size={19}
                                    className='text-gray-600'
                                />
                            </div>

                            <div>
                                <h3 className='text-sm font-semibold text-gray-900 sm:text-base'>
                                    Account Information
                                </h3>

                                <p className='text-xs text-gray-500'>
                                    Your account details
                                </p>
                            </div>
                        </div>

                        <div className='space-y-4'>

                            {/* Name */}
                            <div>
                                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                                    Full Name
                                </label>

                                <div className='relative'>
                                    <User
                                        size={17}
                                        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                                    />

                                    <input
                                        type='text'
                                        value={form.fullName}
                                        readOnly
                                        className='w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-600 outline-none'
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                                    Email
                                </label>

                                <div className='relative'>
                                    <Mail
                                        size={17}
                                        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                                    />

                                    <input
                                        type='email'
                                        value={form.email}
                                        readOnly
                                        className='w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-600 outline-none'
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Password */}
                    <div className='rounded-xl border border-gray-200 bg-white p-4 sm:p-6'>

                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>

                            <div className='flex items-center gap-3'>
                                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100'>
                                    <Lock
                                        size={19}
                                        className='text-gray-600'
                                    />
                                </div>

                                <div>
                                    <h3 className='text-sm font-semibold text-gray-900 sm:text-base'>
                                        Password
                                    </h3>

                                    <p className='text-xs text-gray-500'>
                                        Manage your password
                                    </p>
                                </div>
                            </div>

                            <button
                                type='button'
                                onClick={() => navigate('/auth/reset-password')}
                                className='flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 sm:w-auto'
                            >
                                <Lock size={16} />
                                Change Password
                            </button>

                        </div>

                    </div>

                    {/* Logout */}
                    <div className='rounded-xl border border-gray-200 bg-white p-4 sm:p-6'>

                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>

                            <div>
                                <h3 className='text-sm font-semibold text-gray-900 sm:text-base'>
                                    Logout
                                </h3>

                                <p className='mt-1 text-xs text-gray-500'>
                                    Sign out of your account on this device.
                                </p>
                            </div>

                            <button
                                type='button'
                                onClick={handleLogout}
                                className='flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto'
                            >
                                <LogOut size={16} />
                                Logout
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    )
}

export default Settings