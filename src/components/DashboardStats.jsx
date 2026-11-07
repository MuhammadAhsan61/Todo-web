import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    ListTodo,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const DashboardStats = () => {
    const [todos, setTodos] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('jwt')

        if (!token) {
            setIsLoading(false)
            return
        }

        const getTodos = async () => {
            try {
                const response = await axios.get(
                    `${window.apiURL}/todo/get`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setTodos(response.data.todos || [])
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to get todos'
                )
            } finally {
                setIsLoading(false)
            }
        }

        getTodos()
    }, [])

    const totalTasks = todos.length

    const pendingTasks = todos.filter(
        todo => todo.status === 'pending'
    ).length

    const completedTasks = todos.filter(
        todo => todo.status === 'completed'
    ).length

    const highPriorityTasks = todos.filter(
        todo => todo.priority === 'high'
    ).length

    const stats = [
        {
            title: 'Total Tasks',
            value: totalTasks,
            icon: ListTodo
        },
        {
            title: 'Pending',
            value: pendingTasks,
            icon: Clock
        },
        {
            title: 'Completed',
            value: completedTasks,
            icon: CheckCircle
        },
        {
            title: 'High Priority',
            value: highPriorityTasks,
            icon: AlertCircle
        }
    ]

    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {stats.map((item) => {
                const Icon = item.icon

                return (
                    <div
                        key={item.title}
                        className='rounded-xl border border-gray-200 bg-white p-5'
                    >
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-500'>
                                    {item.title}
                                </p>

                                <h2 className='mt-2 text-2xl font-semibold text-gray-900'>
                                    {isLoading ? '...' : item.value}
                                </h2>
                            </div>

                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100'>
                                <Icon
                                    size={20}
                                    className='text-gray-700'
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default DashboardStats