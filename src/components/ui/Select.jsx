import PropTypes from 'prop-types'
import { cn } from '../../utils/classNames.js'

const BASE = [
  'flex w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-neutral-900',
  'transition-all duration-150',
  'hover:border-neutral-400 dark:hover:border-neutral-500',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50',
  'dark:bg-neutral-800/80 dark:text-neutral-100 dark:border-neutral-600',
  'dark:focus:ring-primary-400/30 dark:focus:border-primary-400',
  'dark:disabled:bg-neutral-800',
  'appearance-none',
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_0.65rem_center]",
  'pr-9',
].join(' ')

export function Select({
  label,
  error,
  id,
  className,
  wrapperClassName,
  children,
  required,
  ...props
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const errorId = error ? `${selectId}-error` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-none"
        >
          {label}
          {required && (
            <span className="ml-1 text-danger-500" aria-hidden="true">*</span>
          )}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          BASE,
          error
            ? 'border-danger-400 focus:ring-danger-500/30 focus:border-danger-500'
            : 'border-neutral-300 dark:border-neutral-600',
          className
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        required={required}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  )
}

Select.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  children: PropTypes.node,
  required: PropTypes.bool,
}
