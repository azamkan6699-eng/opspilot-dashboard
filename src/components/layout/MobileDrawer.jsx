import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart2, Settings, X } from 'lucide-react'
import { cn } from '../../utils/classNames.js'
import { ROUTES } from '../../constants/routes.js'

const NAV_ITEMS = [
  { label: 'Overview',  icon: LayoutDashboard, to: ROUTES.OVERVIEW },
  { label: 'Orders',    icon: ShoppingCart,    to: ROUTES.ORDERS },
  { label: 'Products',  icon: Package,         to: ROUTES.PRODUCTS },
  { label: 'Customers', icon: Users,           to: ROUTES.CUSTOMERS },
  { label: 'Analytics', icon: BarChart2,       to: ROUTES.ANALYTICS },
  { label: 'Settings',  icon: Settings,        to: ROUTES.SETTINGS },
]

export function MobileDrawer({ isOpen, onClose }) {
  const drawerRef = useRef(null)
  const firstFocusRef = useRef(null)
  const previousFocusRef = useRef(null)

  // Save/restore focus
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      setTimeout(() => firstFocusRef.current?.focus(), 0)
    } else {
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return
    const focusable = drawerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const trap = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [isOpen])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-200 dark:bg-neutral-900 lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-header items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <BarChart2 className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">OpsPilot</span>
          </div>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="overflow-y-auto py-4" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-1 px-3" role="list">
            {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === ROUTES.OVERVIEW}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

MobileDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
