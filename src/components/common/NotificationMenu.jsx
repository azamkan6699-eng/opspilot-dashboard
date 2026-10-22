import { useRef, useState } from 'react'
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { useClickOutside } from '../../hooks/useClickOutside.js'
import { formatRelative } from '../../utils/formatDate.js'
import { cn } from '../../utils/classNames.js'
import { Button } from '../ui/Button.jsx'

export function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications()

  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 transition-colors"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Notifications {unreadCount > 0 && <span className="ml-1 text-xs font-normal text-neutral-500">({unreadCount} unread)</span>}
            </h3>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="icon-sm" onClick={markAllRead} aria-label="Mark all as read">
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="icon-sm" onClick={clearAll} aria-label="Clear all notifications">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* List */}
          <ul
            className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-700"
            role="list"
          >
            {notifications.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                No notifications
              </li>
            )}
            {notifications.map((n) => (
              <li
                key={n.id}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 text-sm transition-colors',
                  !n.read && 'bg-primary-50 dark:bg-primary-900/10'
                )}
              >
                <span className="mt-0.5 flex-1">
                  <span className="block text-neutral-800 dark:text-neutral-200">{n.message}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{formatRelative(n.createdAt)}</span>
                </span>
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="mt-0.5 shrink-0 rounded p-0.5 text-neutral-400 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:text-primary-400"
                    aria-label="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
