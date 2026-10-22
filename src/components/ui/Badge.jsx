import PropTypes from 'prop-types'
import { cn } from '../../utils/classNames.js'

const VARIANTS = {
  success: 'bg-success-100 text-success-700 dark:bg-success-700/20 dark:text-success-400',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-700/20 dark:text-warning-400',
  danger:  'bg-danger-100  text-danger-700  dark:bg-danger-700/20  dark:text-danger-400',
  info:    'bg-info-100    text-info-700    dark:bg-info-700/20    dark:text-info-400',
  neutral: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700   dark:text-neutral-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-700/20 dark:text-primary-400',
}

export function Badge({ variant = 'neutral', children, className, dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANTS[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-success-500': variant === 'success',
            'bg-warning-500': variant === 'warning',
            'bg-danger-500':  variant === 'danger',
            'bg-info-500':    variant === 'info',
            'bg-neutral-400': variant === 'neutral',
            'bg-primary-500': variant === 'primary',
          })}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'neutral', 'primary']),
  children: PropTypes.node,
  className: PropTypes.string,
  dot: PropTypes.bool,
}
