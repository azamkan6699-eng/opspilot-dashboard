import { useRef, useState } from 'react'
import { LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../features/auth/AuthContext.jsx'
import { useClickOutside } from '../../hooks/useClickOutside.js'
import { cn } from '../../utils/classNames.js'

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { user, logout } = useAuth()

  useClickOutside(ref, () => setOpen(false), open)

  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="hidden sm:block max-w-[8rem] truncate">{user?.name}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-52 rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
          {/* Info */}
          <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
            <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">{user?.name}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user?.email}</p>
            <p className="mt-1 text-xs capitalize text-neutral-400 dark:text-neutral-500">{user?.role}</p>
          </div>
          {/* Actions */}
          <div className="p-1">
            <button
              onClick={() => { setOpen(false); logout() }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-danger-400 dark:hover:bg-danger-900/20 transition-colors"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
