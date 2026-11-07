import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
    Plus,
    CheckCircle,
    Clock,
    Trash2,
    ListTodo,
    ArrowRight,
    X
} from 'lucide-react'
import DashboardStats from '../../components/DashboardStats'

const initialForm = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
}

const Overview = () => {
    const [todos, setTodos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [statsKey, setStatsKey] = useState(0)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState(initialForm)

    // Fetch todos
    const fetchTodos = () => {
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
                setTodos(response.data.todos || [])
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to get todos'
                )
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchTodos()
    }, [])

    // Open Modal
    const openAddModal = () => {
        setForm(initialForm)
        setIsModalOpen(true)
    }

    // Close Modal
    const closeModal = () => {
        if (isSubmitting) return
        setIsModalOpen(false)
        setForm(initialForm)
    }

    // Handle Form Input Change
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // Add Todo
    const handleSubmit = (e) => {
        e.preventDefault()

        const token = localStorage.getItem('jwt')

        if (!token) {
            toast.error('Please login first')
            return
        }

        if (!form.title.trim()) {
            toast.error('Title is required')
            return
        }

        setIsSubmitting(true)

        axios.post(
            `${window.apiURL}/todo/add`,
            {
                title: form.title.trim(),
                description: form.description.trim(),
                priority: form.priority,
                dueDate: form.dueDate || null
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((response) => {
                setTodos((prev) => [
                    response.data.todo,
                    ...prev
                ])
                setStatsKey((prev) => prev + 1)
                toast.success('Todo added successfully')
                closeModal()
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to add todo'
                )
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }

    // Toggle Status
    const toggleStatus = (todo) => {
        const token = localStorage.getItem('jwt')

        if (!token) {
            toast.error('Please login first')
            return
        }

        const status =
            todo.status === 'completed'
                ? 'pending'
                : 'completed'

        axios.put(
            `${window.apiURL}/todo/edit/${todo._id}`,
            {
                title: todo.title,
                description: todo.description,
                status,
                priority: todo.priority,
                dueDate: todo.dueDate || null
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((response) => {
                setTodos((prev) =>
                    prev.map((item) =>
                        item._id === todo._id
                            ? response.data.todo
                            : item
                    )
                )
                setStatsKey((prev) => prev + 1)
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to update todo'
                )
            })
    }

    // Delete Todo
    const handleDelete = (id) => {
        const token = localStorage.getItem('jwt')

        if (!token) {
            toast.error('Please login first')
            return
        }

        if (
            !window.confirm(
                'Are you sure you want to delete this todo?'
            )
        ) {
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
                setStatsKey((prev) => prev + 1)
                toast.success('Todo deleted successfully')
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to delete todo'
                )
            })
    }

    const recentTodos = todos.slice(0, 5)

    return (
        <div className='w-full min-w-0 space-y-6'>

            {/* Page Heading */}
            <div className='flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='min-w-0'>
                    <h2 className='truncate text-xl font-semibold text-gray-900 sm:text-2xl'>
                        Overview
                    </h2>

                    <p className='mt-1 text-xs text-gray-500 sm:text-sm'>
                        Welcome back! Here's what's happening with your tasks.
                    </p>
                </div>

                <div className='flex items-center gap-2'>
                    <Link
                        to='/dashboard/todos'
                        className='flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
                    >
                        <span>View All</span>
                        <ArrowRight size={16} />
                    </Link>

                    <button
                        type='button'
                        onClick={openAddModal}
                        className='flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]'
                    >
                        <Plus size={18} />
                        <span>Add Todo</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <DashboardStats key={statsKey} />

            {/* Recent Tasks */}
            <div className='mt-8 rounded-xl border border-gray-200 bg-white shadow-sm'>
                <div className='flex items-center justify-between border-b border-gray-200 p-4 sm:p-5'>
                    <div>
                        <h3 className='font-semibold text-gray-900'>
                            Recent Tasks
                        </h3>

                        <p className='mt-0.5 text-xs text-gray-500 sm:text-sm'>
                            Your latest todo items.
                        </p>
                    </div>

                    <Link
                        to='/dashboard/todos'
                        className='inline-flex items-center gap-1 text-xs font-medium text-gray-600 transition hover:text-gray-900 sm:text-sm'
                    >
                        <span>View all</span>
                        <ArrowRight size={15} />
                    </Link>
                </div>

                {isLoading ? (
                    <div className='flex min-h-[180px] w-full items-center justify-center p-6'>
                        <p className='text-sm text-gray-500'>
                            Loading recent tasks...
                        </p>
                    </div>
                ) : todos.length === 0 ? (
                    <div className='flex min-h-[220px] w-full flex-col items-center justify-center px-4 py-8 text-center'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                            <ListTodo
                                size={22}
                                className='text-gray-500'
                            />
                        </div>

                        <p className='mt-4 text-sm text-gray-500'>
                            You don't have any todos yet.
                        </p>

                        <button
                            type='button'
                            onClick={openAddModal}
                            className='mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800'
                        >
                            <Plus size={16} />
                            <span>Create Todo</span>
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className='divide-y divide-gray-100'>
                            {recentTodos.map((todo) => (
                                <article
                                    key={todo._id}
                                    className='flex flex-col gap-3 p-4 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between sm:p-5'
                                >
                                    <div className='flex min-w-0 items-start gap-3'>
                                        <button
                                            type='button'
                                            onClick={() => toggleStatus(todo)}
                                            className='mt-0.5 shrink-0 transition active:scale-95'
                                            title={
                                                todo.status === 'completed'
                                                    ? 'Mark as pending'
                                                    : 'Mark as completed'
                                            }
                                        >
                                            {todo.status === 'completed' ? (
                                                <CheckCircle
                                                    size={20}
                                                    className='text-green-600'
                                                />
                                            ) : (
                                                <Clock
                                                    size={20}
                                                    className='text-gray-400 hover:text-gray-600'
                                                />
                                            )}
                                        </button>

                                        <div className='min-w-0 flex-1'>
                                            <h4
                                                className={`break-words text-sm font-medium leading-5 ${
                                                    todo.status === 'completed'
                                                        ? 'text-gray-400 line-through'
                                                        : 'font-semibold text-gray-900'
                                                }`}
                                            >
                                                {todo.title}
                                            </h4>

                                            {todo.description && (
                                                <p className='mt-0.5 line-clamp-1 text-xs text-gray-500'>
                                                    {todo.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex shrink-0 items-center justify-between gap-3 sm:justify-end'>
                                        <div className='flex flex-wrap items-center gap-1.5'>
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                                                    todo.status === 'completed'
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {todo.status}
                                            </span>

                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                                                    todo.priority === 'high'
                                                        ? 'bg-red-50 text-red-700'
                                                        : todo.priority === 'medium'
                                                            ? 'bg-amber-50 text-amber-700'
                                                            : 'bg-blue-50 text-blue-700'
                                                }`}
                                            >
                                                {todo.priority}
                                            </span>

                                            {todo.dueDate && (
                                                <span className='rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600'>
                                                    Due:{' '}
                                                    {new Date(
                                                        todo.dueDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type='button'
                                            onClick={() => handleDelete(todo._id)}
                                            className='rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600'
                                            title='Delete task'
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {todos.length > 5 && (
                            <div className='border-t border-gray-100 bg-gray-50/50 p-3 text-center'>
                                <Link
                                    to='/dashboard/todos'
                                    className='text-xs font-medium text-gray-600 hover:text-gray-900'
                                >
                                    Showing 5 of {todos.length} tasks • View all tasks &rarr;
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className='fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center sm:p-4'
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal()
                        }
                    }}
                >
                    <div className='flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white sm:max-h-[90vh] sm:max-w-lg sm:rounded-xl'>

                        {/* Modal Header */}
                        <div className='flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6'>
                            <div className='min-w-0'>
                                <h3 className='truncate text-base font-semibold text-gray-900 sm:text-lg'>
                                    Create Todo
                                </h3>

                                <p className='mt-0.5 text-xs text-gray-500'>
                                    Create a new task.
                                </p>
                            </div>

                            <button
                                type='button'
                                onClick={closeModal}
                                disabled={isSubmitting}
                                className='ml-3 shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100'
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className='min-h-0 overflow-y-auto p-4 sm:p-6'
                        >
                            <div className='space-y-4'>

                                {/* Title */}
                                <div>
                                    <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                                        Title
                                    </label>

                                    <input
                                        type='text'
                                        name='title'
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder='Enter todo title'
                                        className='w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400'
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                                        Description
                                    </label>

                                    <textarea
                                        name='description'
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder='Enter description'
                                        className='w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400'
                                    />
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                                        Priority
                                    </label>

                                    <select
                                        name='priority'
                                        value={form.priority}
                                        onChange={handleChange}
                                        className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400'
                                    >
                                        <option value='low'>
                                            Low
                                        </option>
                                        <option value='medium'>
                                            Medium
                                        </option>
                                        <option value='high'>
                                            High
                                        </option>
                                    </select>
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                                        Due Date
                                    </label>

                                    <input
                                        type='date'
                                        name='dueDate'
                                        value={form.dueDate}
                                        onChange={handleChange}
                                        className='w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400'
                                    />
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className='mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
                                <button
                                    type='button'
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className='w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 sm:w-auto'
                                >
                                    Cancel
                                </button>

                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 sm:w-auto'
                                >
                                    {isSubmitting
                                        ? 'Saving...'
                                        : 'Create Todo'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    )
}

export default Overview