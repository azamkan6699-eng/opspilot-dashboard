import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '../../utils/classNames.js'

const ToastCtx = createContext(null)
const DURATION = 4500

const ICON = {
  success: <CheckCircle className="h-[18px] w-[18px] shrink-0 text-success-500" aria-hidden="true" />,
  error:   <XCircle    className="h-[18px] w-[18px] shrink-0 text-danger-500"  aria-hidden="true" />,
  info:    <Info       className="h-[18px] w-[18px] shrink-0 text-primary-500" aria-hidden="true" />,
}

const BORDER = {
  success: 'border-l-4 border-l-success-500',
  error:   'border-l-4 border-l-danger-500',
  info:    'border-l-4 border-l-primary-500',
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':    return [...state, action.toast]
    case 'REMOVE': return state.filter((t) => t.id !== action.id)
    default:       return state
  }
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const toast = useCallback((message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    dispatch({ type: 'ADD', toast: { id, message, type } })
    setTimeout(() => dispatch({ type: 'REMOVE', id }), DURATION)
  }, [])

  const dismiss = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end sm:w-[22rem]"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

ToastProvider.propTypes = { children: PropTypes.node.isRequired }

function ToastItem({ toast, onDismiss }) {
  const barRef = useRef(null)

  /* Animate the progress bar from 100% → 0% after mount */
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    // Force reflow so the transition fires
    bar.getBoundingClientRect()
    bar.style.transition = `width ${DURATION}ms linear`
    bar.style.width = '0%'
  }, [])

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800',
        BORDER[toast.type]
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        {ICON[toast.type] ?? ICON.info}
        <p className="flex-1 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
          {toast.message}
        </p>
        <button
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss"
          className="ml-1 shrink-0 rounded-md p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div
        ref={barRef}
        className={cn(
          'absolute bottom-0 left-0 h-[2px] w-full',
          toast.type === 'success' ? 'bg-success-400' :
          toast.type === 'error'   ? 'bg-danger-400' :
                                     'bg-primary-400'
        )}
      />
    </div>
  )
}

ToastItem.propTypes = {
  toast:     PropTypes.shape({ id: PropTypes.string, message: PropTypes.string, type: PropTypes.string }).isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
