import PropTypes from 'prop-types'
import { cn } from '../../utils/classNames.js'

/** Animated placeholder shown while content is loading. */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('skeleton rounded bg-neutral-200 dark:bg-neutral-700', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

Skeleton.propTypes = { className: PropTypes.string }

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')} />
      ))}
    </div>
  )
}

SkeletonText.propTypes = { lines: PropTypes.number, className: PropTypes.string }

export function SkeletonCard({ className }) {
  return (
    <div className={cn('rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800', className)} aria-hidden="true">
      <Skeleton className="mb-3 h-4 w-1/3" />
      <Skeleton className="mb-2 h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

SkeletonCard.propTypes = { className: PropTypes.string }

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700" aria-hidden="true">
      <div className="bg-neutral-50 p-3 dark:bg-neutral-800/50 flex gap-4">
        {Array.from({ length: cols }, (_, i) => <Skeleton key={i} className="h-4 flex-1" />)}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-4 border-t border-neutral-200 p-3 dark:border-neutral-700">
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton key={c} className={cn('h-4 flex-1', c === 0 && 'w-8 flex-none')} />
          ))}
        </div>
      ))}
    </div>
  )
}

SkeletonTable.propTypes = { rows: PropTypes.number, cols: PropTypes.number }
