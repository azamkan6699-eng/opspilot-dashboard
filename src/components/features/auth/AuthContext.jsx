import { createContext, useContext, useReducer, useCallback } from 'react'
import PropTypes from 'prop-types'
import { storage } from '../../../services/storage.js'
import { USER_ROLE } from '../../../constants/statuses.js'

const DEMO_USERS = [
  { id: 'usr-1', email: 'admin@opspilot.dev', password: 'Admin123!', name: 'Admin User', role: USER_ROLE.ADMIN },
  { id: 'usr-2', email: 'viewer@opspilot.dev', password: 'Viewer123!', name: 'Viewer User', role: USER_ROLE.VIEWER },
]

const AuthContext = createContext(null)

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.user, error: null }
    case 'LOGOUT':
      return { user: null, error: null }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: storage.getAuth(),
    error: null,
  })

  const login = useCallback(async (email, password) => {
    // Simulated async auth
    await new Promise((r) => setTimeout(r, 400))
    const user = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) {
      dispatch({ type: 'SET_ERROR', error: 'Invalid email or password.' })
      throw new Error('Invalid email or password.')
    }
    const session = { id: user.id, email: user.email, name: user.name, role: user.role }
    storage.setAuth(session)
    dispatch({ type: 'LOGIN', user: session })
    return session
  }, [])

  const logout = useCallback(() => {
    storage.clearAuth()
    dispatch({ type: 'LOGOUT' })
  }, [])

  const clearError = useCallback(() => dispatch({ type: 'SET_ERROR', error: null }), [])

  return (
    <AuthContext.Provider value={{ user: state.user, error: state.error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired }

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
