import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import { ROUTES } from '../../../constants/routes.js'

/**
 * Wraps routes that require authentication.
 * Saves the intended destination so login can redirect back after success.
 */
export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
