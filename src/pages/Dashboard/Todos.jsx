import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Plus,
    CheckCircle,
    Clock,
    Trash2,
    Pencil,
    ListTodo,
    X
} from 'lucide-react'
import toast from 'react-hot-toast'

const initialForm = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
}

const Todos = () => {
    const [todos, setTodos] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [form, setForm] = useState(initialForm)
    const [editingTodo, setEditingTodo] = useState(null)

    // Get Todos
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
    }, [])

    // Open Add Modal
    const openAddModal = () => {
        setEditingTodo(null)
        setForm(initialForm)
        setIsModalOpen(true)
    }

    // Open Edit Modal
    const openEditModal = (todo) => {
        setEditingTodo(todo)

        setForm({
            title: todo.title || '',
            description: todo.description || '',
            priority: todo.priority || 'medium',
            dueDate: todo.dueDate
                ? new Date(todo.dueDate)
                    .toISOString()
                    .split('T')[0]
                : ''
        })

        setIsModalOpen(true)
    }

    // Close Modal
    const closeModal = () => {
        if (isSubmitting) return

        setIsModalOpen(false)
        setEditingTodo(null)
        setForm(initialForm)
    }

    // Form Change
    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // Add / Edit Todo
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

        if (editingTodo) {

            axios.put(
                `${window.apiURL}/todo/edit/${editingTodo._id}`,
                {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    status: editingTodo.status,
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
                    setTodos((prev) =>
                        prev.map((todo) =>
                            todo._id === editingTodo._id
                                ? response.data.todo
                                : todo
                        )
                    )

                    toast.success('Todo updated successfully')
                    closeModal()
                })
                .catch((error) => {
                    toast.error(
                        error.response?.data?.message ||
                        'Failed to update todo'
                    )
                })
                .finally(() => {
                    setIsSubmitting(false)
                })

        } else {

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

                toast.success('Todo deleted successfully')
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to delete todo'
                )
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
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                    'Failed to update todo'
                )
            })
    }

    return (
        <div className='w-full min-w-0'>

            {/* Header */}
            <div className='mb-5 flex w-full min-w-0 flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between'>

                <div className='min-w-0'>
                    <h2 className='truncate text-xl font-semibold text-gray-900 sm:text-2xl'>
                        My Todos
                    </h2>

                    <p className='mt-1 text-xs text-gray-500 sm:text-sm'>
                        Manage all your tasks.
                    </p>
                </div>

                <button
                    type='button'
                    onClick={openAddModal}
                    className='flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98] sm:w-auto'
                >
                    <Plus size={18} />
                    Add Todo
                </button>

            </div>

            {/* Content */}
            {isLoading ? (

                <div className='flex min-h-[180px] w-full items-center justify-center rounded-xl border border-gray-200 bg-white p-6'>
                    <p className='text-sm text-gray-500'>
                        Loading todos...
                    </p>
                </div>

            ) : todos.length === 0 ? (

                <div className='flex min-h-[240px] w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-8 text-center sm:min-h-[300px] sm:px-8'>

                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100'>
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
                        className='mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white'
                    >
                        <Plus size={17} />
                        Create Todo
                    </button>

                </div>

            ) : (

                <div className='grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 2xl:grid-cols-3'>

                    {todos.map((todo) => (

                        <article
                            key={todo._id}
                            className='flex min-w-0 w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 sm:p-5'
                        >

                            {/* Todo */}
                            <div className='flex min-w-0 items-start gap-3'>

                                <button
                                    type='button'
                                    onClick={() => toggleStatus(todo)}
                                    className='mt-0.5 shrink-0'
                                >
                                    {todo.status === 'completed' ? (
                                        <CheckCircle
                                            size={20}
                                            className='text-green-600'
                                        />
                                    ) : (
                                        <Clock
                                            size={20}
                                            className='text-gray-400'
                                        />
                                    )}
                                </button>

                                <div className='min-w-0 flex-1'>

                                    <h3
                                        className={`break-words text-sm font-semibold leading-5 sm:text-base ${
                                            todo.status === 'completed'
                                                ? 'text-gray-400 line-through'
                                                : 'text-gray-900'
                                        }`}
                                    >
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

                                <span className='rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium capitalize text-gray-600 sm:text-xs'>
                                    {todo.status}
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
                            <div className='mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4'>

                                <button
                                    type='button'
                                    onClick={() => openEditModal(todo)}
                                    className='flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 sm:text-sm'
                                >
                                    <Pencil
                                        size={15}
                                        className='shrink-0'
                                    />

                                    <span>
                                        Edit
                                    </span>
                                </button>

                                <button
                                    type='button'
                                    onClick={() => handleDelete(todo._id)}
                                    className='flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2 py-2.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:text-sm'
                                >
                                    <Trash2
                                        size={15}
                                        className='shrink-0'
                                    />

                                    <span>
                                        Delete
                                    </span>
                                </button>

                            </div>

                        </article>

                    ))}

                </div>
            )}

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
                                    {editingTodo
                                        ? 'Edit Todo'
                                        : 'Create Todo'}
                                </h3>

                                <p className='mt-0.5 text-xs text-gray-500'>
                                    {editingTodo
                                        ? 'Update your task.'
                                        : 'Create a new task.'}
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
                                        : editingTodo
                                            ? 'Update Todo'
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

export default Todos