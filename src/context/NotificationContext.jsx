import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { storage } from '../services/storage.js'

const NotificationContext = createContext(null)

function notifReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return action.payload
    case 'ADD':
      return [action.payload, ...state]
    case 'MARK_READ':
      return state.map((n) => (n.id === action.id ? { ...n, read: true } : n))
    case 'MARK_ALL_READ':
      return state.map((n) => ({ ...n, read: true }))
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(notifReducer, [])

  // Load from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'LOAD', payload: storage.getNotifications() })
  }, [])

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    storage.setNotifications(notifications)
  }, [notifications])

  const addNotification = useCallback((notification) => {
    dispatch({
      type: 'ADD',
      payload: {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        read: false,
        createdAt: new Date().toISOString(),
        ...notification,
      },
    })
  }, [])

  const markRead = useCallback((id) => dispatch({ type: 'MARK_READ', id }), [])
  const markAllRead = useCallback(() => dispatch({ type: 'MARK_ALL_READ' }), [])
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markRead, markAllRead, clearAll, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

NotificationProvider.propTypes = { children: PropTypes.node.isRequired }

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider')
  return ctx
}
