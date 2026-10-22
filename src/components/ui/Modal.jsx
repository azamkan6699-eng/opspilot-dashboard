import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { X } from 'lucide-react'
import { cn } from '../../utils/classNames.js'

const SIZE_CLASSES = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-full mx-4',
}

/**
 * Accessible modal with focus-trap, Escape-to-close, and focus restore.
 * On mobile it renders as a bottom sheet; on sm+ as a centred dialog.
 */
export function Modal({ isOpen, onClose, title, children, size = 'md', className }) {
  const dialogRef = useRef(null)
  const prevFocusRef = useRef(null)

  /* ── Save & restore focus ── */
  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement
      const t = setTimeout(() => {
        const first = dialogRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        first?.focus()
      }, 0)
      return () => clearTimeout(t)
    }
    prevFocusRef.current?.focus()
  }, [isOpen])

  /* ── Escape to close ── */
  useEffect(() => {
    if (!isOpen) return
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [isOpen, onClose])

  /* ── Focus trap ── */
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return
    const els = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!els.length) return
    const first = els[0], last = els[els.length - 1]
    const trap = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus()
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [isOpen])

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 flex w-full flex-col bg-white dark:bg-neutral-900',
          'shadow-2xl',
          /* Mobile: bottom sheet with rounded top corners */
          'rounded-t-2xl max-h-[92dvh]',
          /* sm+: centred card */
          'sm:rounded-xl sm:max-h-[90vh]',
          SIZE_CLASSES[size],
          className
        )}
      >
        {/* ── Header ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <h2
            id="modal-title"
            className="text-base font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  isOpen:    PropTypes.bool.isRequired,
  onClose:   PropTypes.func.isRequired,
  title:     PropTypes.string.isRequired,
  children:  PropTypes.node,
  size:      PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  className: PropTypes.string,
}
