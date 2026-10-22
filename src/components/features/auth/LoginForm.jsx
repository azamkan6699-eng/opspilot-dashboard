import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, BarChart2 } from 'lucide-react'
import { useAuth } from './AuthContext.jsx'
import { Input } from '../../ui/Input.jsx'
import { Button } from '../../ui/Button.jsx'
import { isValidEmail } from '../../../utils/validators.js'
import { ROUTES } from '../../../constants/routes.js'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login, error: authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || ROUTES.OVERVIEW

  function validate() {
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required.'
    else if (!isValidEmail(email)) errs.email = 'Enter a valid email address.'
    if (!password) errs.password = 'Password is required.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch {
      // authError is set in context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 shadow-md">
            <BarChart2 className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">OpsPilot</h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Sign in to your dashboard</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Email address"
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              placeholder="you@example.com"
            />

            <div className="relative flex flex-col gap-1">
              <Input
                label="Password"
                id="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-[2.1rem] text-neutral-400 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded dark:hover:text-neutral-200"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {authError && (
              <p role="alert" className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700 dark:bg-danger-900/30 dark:text-danger-400">
                {authError}
              </p>
            )}

            <Button type="submit" loading={loading} className="mt-1">
              Sign in
            </Button>
          </form>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
          <p className="mb-2 font-medium text-neutral-700 dark:text-neutral-300">Demo credentials</p>
          <div className="flex flex-col gap-1.5">
            <DemoCred email="admin@opspilot.dev" password="Admin123!" role="Admin" onUse={(e, p) => { setEmail(e); setPassword(p) }} />
            <DemoCred email="viewer@opspilot.dev" password="Viewer123!" role="Viewer" onUse={(e, p) => { setEmail(e); setPassword(p) }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoCred({ email, password, role, onUse }) {
  return (
    <button
      type="button"
      onClick={() => onUse(email, password)}
      className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-neutral-800 transition-colors"
    >
      <span>
        <span className="font-medium text-neutral-600 dark:text-neutral-300">{role}</span>
        <span className="ml-2">{email}</span>
      </span>
      <span className="text-primary-600 dark:text-primary-400">Use →</span>
    </button>
  )
}
