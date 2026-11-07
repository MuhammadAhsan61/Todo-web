import React, { useState } from 'react'
import DashboardSidebar from '../../components/DashboardSidebar'
import DashboardHeader from '../../components/DashboardHeader'
import Routes from './Routes'

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className='min-h-screen w-full overflow-x-hidden bg-gray-50'>

            {/* Sidebar */}
            <DashboardSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Main */}
            <main className='min-h-screen w-full min-w-0 lg:ml-64 lg:w-[calc(100%-16rem)]'>

                {/* Header */}
                <DashboardHeader
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Page Content */}
                <div className='w-full min-w-0 p-3 sm:p-4 md:p-6 lg:p-6'>
                    <Routes />
                </div>

            </main>

        </div>
    )
}

export default Dashboard