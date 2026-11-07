import React from 'react'
import { Bell, Menu, Search } from 'lucide-react'

const DashboardHeader = ({ setIsSidebarOpen }) => {
    return (
        <header className='flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6'>

            <div className='flex items-center gap-3'>

                {/* Mobile Drawer Button */}
                <button
                    type='button'
                    onClick={() => setIsSidebarOpen(true)}
                    className='rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden'
                >
                    <Menu size={22} />
                </button>

                <div>
                    <h1 className='text-lg font-semibold text-gray-900'>
                        Dashboard
                    </h1>

                    <p className='hidden text-xs text-gray-500 sm:block'>
                        Manage your tasks
                    </p>
                </div>

            </div>

            <div className='flex items-center gap-2 sm:gap-4'>

                <div className='hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 md:flex'>
                    <Search size={17} className='text-gray-400' />

                    <input
                        type='text'
                        placeholder='Search tasks...'
                        className='w-40 bg-transparent text-sm outline-none lg:w-48'
                    />
                </div>

                <button
                    type='button'
                    className='rounded-lg p-2 text-gray-600 hover:bg-gray-100'
                >
                    <Bell size={20} />
                </button>

                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white'>
                    A
                </div>

            </div>

        </header>
    )
}

export default DashboardHeader