import PropTypes from 'prop-types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../utils/classNames.js'
import { Card } from '../ui/Card.jsx'
import { Skeleton } from '../ui/Skeleton.jsx'

export function StatCard({ title, value, change, changeLabel, icon: Icon, iconColor, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="mb-2 h-8 w-32" />
        <Skeleton className="h-3 w-20" />
      </Card>
    )
  }

  const positive = change > 0
  const neutral = change === 0

  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
        {Icon && (
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg',
              iconColor ?? 'bg-primary-50 dark:bg-primary-900/20'
            )}
          >
            <Icon className={cn('h-5 w-5', iconColor ? 'text-white' : 'text-primary-600 dark:text-primary-400')} aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
      {change !== undefined && (
        <div className="mt-1 flex items-center gap-1">
          {neutral ? (
            <Minus className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
          ) : positive ? (
            <TrendingUp className="h-3.5 w-3.5 text-success-600 dark:text-success-400" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-danger-600 dark:text-danger-400" aria-hidden="true" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              neutral
                ? 'text-neutral-500'
                : positive
                ? 'text-success-600 dark:text-success-400'
                : 'text-danger-600 dark:text-danger-400'
            )}
          >
            {positive ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{changeLabel}</span>
          )}
        </div>
      )}
    </Card>
  )
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.number,
  changeLabel: PropTypes.string,
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
  isLoading: PropTypes.bool,
}
