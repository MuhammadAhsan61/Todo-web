import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    CheckCircle,
    Trash2,
    Pencil,
    ListTodo
} from 'lucide-react'
import toast from 'react-hot-toast'

const Completed = () => {
    const [todos, setTodos] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Get Completed Todos
    useEffect(() => {
        const token = localStorage.getItem('jwt')

        if (!token) {
            setIsLoading(false)
            return
        }

        axios.get(
            `${window.apiURL}/todo/get`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((response) => {
                const completedTodos = (response.data.todos || [])
                    .filter((todo) => todo.status === 'completed')

                setTodos(completedTodos)
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to get completed todos'
                )
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    // Delete Todo
    const handleDelete = (id) => {
        const token = localStorage.getItem('jwt')

        if (!token) {
            toast.error('Please login first')
            return
        }

        if (!window.confirm('Are you sure you want to delete this todo?')) {
            return
        }

        axios.delete(
            `${window.apiURL}/todo/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(() => {
                setTodos((prev) =>
                    prev.filter((todo) => todo._id !== id)
                )

                toast.success('Todo deleted successfully')
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to delete todo'
                )
            })
    }

    return (
        <div className='w-full min-w-0'>

            {/* Header */}
            <div className='mb-5 sm:mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 sm:text-2xl'>
                    Completed Todos
                </h2>

                <p className='mt-1 text-xs text-gray-500 sm:text-sm'>
                    View all your completed tasks.
                </p>
            </div>

            {/* Loading */}
            {isLoading ? (

                <div className='flex min-h-[180px] w-full items-center justify-center rounded-xl border border-gray-200 bg-white p-6'>
                    <p className='text-sm text-gray-500'>
                        Loading completed todos...
                    </p>
                </div>

            ) : todos.length === 0 ? (

                /* Empty State */
                <div className='flex min-h-[240px] w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-8 text-center sm:min-h-[300px]'>

                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                        <ListTodo
                            size={22}
                            className='text-gray-500'
                        />
                    </div>

                    <p className='mt-4 text-sm text-gray-500'>
                        You don't have any completed todos yet.
                    </p>

                </div>

            ) : (

                /* Todos */
                <div className='grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 2xl:grid-cols-3'>

                    {todos.map((todo) => (

                        <article
                            key={todo._id}
                            className='flex min-w-0 w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 sm:p-5'
                        >

                            {/* Todo Content */}
                            <div className='flex min-w-0 items-start gap-3'>

                                <CheckCircle
                                    size={20}
                                    className='mt-0.5 shrink-0 text-green-600'
                                />

                                <div className='min-w-0 flex-1'>

                                    <h3 className='break-words text-sm font-semibold leading-5 text-gray-400 line-through sm:text-base'>
                                        {todo.title}
                                    </h3>

                                    {todo.description && (
                                        <p className='mt-1 break-words text-xs leading-5 text-gray-500 sm:text-sm'>
                                            {todo.description}
                                        </p>
                                    )}

                                </div>

                            </div>

                            {/* Badges */}
                            <div className='mt-4 flex min-w-0 flex-wrap gap-2'>

                                <span className='rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-600 sm:text-xs'>
                                    Completed
                                </span>

                                <span className='rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium capitalize text-gray-600 sm:text-xs'>
                                    {todo.priority} priority
                                </span>

                                {todo.dueDate && (
                                    <span className='max-w-full truncate rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 sm:text-xs'>
                                        Due:{' '}
                                        {new Date(
                                            todo.dueDate
                                        ).toLocaleDateString()}
                                    </span>
                                )}

                            </div>

                            {/* Actions */}
                            <div className='mt-4 border-t border-gray-100 pt-4'>

                                <button
                                    type='button'
                                    onClick={() => handleDelete(todo._id)}
                                    className='flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:text-sm'
                                >
                                    <Trash2
                                        size={15}
                                        className='shrink-0'
                                    />

                                    Delete
                                </button>

                            </div>

                        </article>

                    ))}

                </div>
            )}

        </div>
    )
}

export default Completed