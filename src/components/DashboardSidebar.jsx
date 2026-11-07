import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    ListTodo,
    CheckCircle,
    Settings,
    LogOut,
    X
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
    const {handleLogout} = useAuth()

    const navItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard
        },
        {
            name: 'My Todos',
            path: '/dashboard/todos',
            icon: ListTodo
        },
        {
            name: 'Completed',
            path: '/dashboard/completed',
            icon: CheckCircle
        },
        {
            name: 'Settings',
            path: '/dashboard/settings',
            icon: Settings
        }
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className='fixed inset-0 z-40 bg-black/40 lg:hidden'
                />
            )}

            <aside
                className={`
                fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
                border-r border-gray-200 bg-white
                transition-transform duration-300
                lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >

                {/* Logo */}
                <div className='flex h-16 items-center justify-between border-b border-gray-200 px-6'>
                    <h1 className='text-xl font-bold text-gray-900'>
                        Todo App
                    </h1>

                    <button
                        onClick={() => setIsOpen(false)}
                        className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden'
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className='flex-1 space-y-1 p-4'>
                    {navItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`
                                }
                            >
                                <Icon size={19} />
                                {item.name}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div className='border-t border-gray-200 p-4'>
                    <button  className='flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100' onClick={handleLogout}>
                        <LogOut size={19} />
                        Logout
                    </button>
                </div>

            </aside>
        </>
    )
}

export default DashboardSidebar