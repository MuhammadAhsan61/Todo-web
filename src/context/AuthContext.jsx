import axios from 'axios'
import React, {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react'

const Auth = createContext()

const initialState = {
    isAuth: false,
    user: {},
}

const reducer = (state, { type, payload }) => {
    switch (type) {
        case 'SET_LOGIN':
            return {
                isAuth: true,
                user: payload.user,
            }

        case 'SET_LOGOUT':
            return {
                isAuth: false,
                user: {},
            }

        default:
            return state
    }
}

const AuthContext = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isAppLoading, setIsAppLoading] = useState(true)

    const handleLogout = () => {
        dispatch({ type: 'SET_LOGOUT' })
        localStorage.removeItem('jwt')
    }

    const readProfile = (token) => {
        if (!token) {
            setIsAppLoading(false)
            return
        }

        axios.get(`${window.apiURL}/auth/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(({ status, data }) => {
                const { user } = data

                if (status === 200) {
                    dispatch({
                        type: 'SET_LOGIN',
                        payload: { user },
                    })
                }
            })
            .catch((error) => {
                console.error(error)
                handleLogout()
            })
            .finally(() => {
                setIsAppLoading(false)
            })
    }

    useEffect(() => {
        const token = localStorage.getItem('jwt')
        readProfile(token)
    }, [])

    return (
        <Auth.Provider
            value={{
                ...state,
                dispatch,
                isAppLoading,
                handleLogout,
                readProfile,
            }}
        >
            {children}
        </Auth.Provider>
    )
}

export const useAuth = () => useContext(Auth)

export default AuthContext
