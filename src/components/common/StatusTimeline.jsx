import PropTypes from 'prop-types'
import { Check } from 'lucide-react'
import { cn } from '../../utils/classNames.js'
import { ORDER_STATUS } from '../../constants/statuses.js'
import { formatDateTime } from '../../utils/formatDate.js'

const FLOW = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
]

export function StatusTimeline({ status, createdAt, updatedAt }) {
  const isCancelled = status === ORDER_STATUS.CANCELLED
  const currentIdx = isCancelled ? -1 : FLOW.indexOf(status)

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 dark:border-danger-700/50 dark:bg-danger-900/20">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-danger-500 text-white text-xs font-bold shrink-0">✕</span>
        <div>
          <p className="text-sm font-medium text-danger-700 dark:text-danger-400">Order Cancelled</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDateTime(updatedAt)}</p>
        </div>
      </div>
    )
  }

  return (
    <ol className="relative flex flex-col gap-0" aria-label="Order status timeline">
      {FLOW.map((step, idx) => {
        const completed = idx < currentIdx
        const active    = idx === currentIdx
        const upcoming  = idx > currentIdx

        return (
          <li key={step} className="flex items-start gap-4 pb-5 last:pb-0">
            {/* Connector line */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  completed && 'bg-success-500 text-white',
                  active    && 'bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900/30',
                  upcoming  && 'bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500'
                )}
                aria-hidden="true"
              >
                {completed ? <Check className="h-4 w-4" /> : idx + 1}
              </span>
              {idx < FLOW.length - 1 && (
                <span
                  className={cn(
                    'mt-1 w-0.5 flex-1 min-h-[1.5rem]',
                    completed ? 'bg-success-400' : 'bg-neutral-200 dark:bg-neutral-700'
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
            {/* Label */}
            <div className="mt-0.5">
              <p className={cn(
                'text-sm font-medium',
                active    && 'text-primary-700 dark:text-primary-400',
                completed && 'text-success-700 dark:text-success-400',
                upcoming  && 'text-neutral-400 dark:text-neutral-500'
              )}>
                {step}
                {active && <span className="ml-2 text-xs font-normal text-neutral-500">Current</span>}
              </p>
              {active && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDateTime(updatedAt)}</p>
              )}
              {idx === 0 && (
                <p className="text-xs text-neutral-400 dark:text-neutral-500">{formatDateTime(createdAt)}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

StatusTimeline.propTypes = {
  status: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
}
