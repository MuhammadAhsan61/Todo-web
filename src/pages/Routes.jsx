import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Frontend from './Frontend'
import PageNotFound from '@/components/PageNotFound'
import Auth from './Auth'
import Dashboard from './Dashboard/Dashboard'

const Index = () => {
    const token = localStorage.getItem('jwt')

    return (
        <Routes>

            {/* Auth - Guest Only */}
            <Route
                path='/auth/*'
                element={
                    token
                        ? <Navigate to='/dashboard' replace />
                        : <Auth />
                }
            />

            {/* Dashboard - Logged In Only */}
            <Route
                path='/dashboard/*'
                element={
                    token
                        ? <Dashboard />
                        : <Navigate to='/auth/login' replace />
                }
            />

            {/* Frontend - Public */}
            <Route
                path='/*'
                element={<Frontend />}
            />

            {/* 404 */}
            <Route
                path='*'
                element={<PageNotFound />}
            />

        </Routes>
    )
}

export default Index