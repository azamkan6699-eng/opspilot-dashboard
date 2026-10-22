import PropTypes from 'prop-types'
import { cn } from '../../utils/classNames.js'

const BASE = [
  'flex w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-neutral-900',
  'placeholder:text-neutral-400 leading-relaxed',
  'transition-all duration-150',
  'hover:border-neutral-400 dark:hover:border-neutral-500',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
  'disabled:opacity-50 disabled:bg-neutral-50 disabled:cursor-not-allowed',
  'dark:bg-neutral-800/80 dark:text-neutral-100 dark:placeholder:text-neutral-500',
  'dark:focus:ring-primary-400/30 dark:focus:border-primary-400',
  'resize-y',
].join(' ')

export function Textarea({
  label,
  error,
  id,
  className,
  wrapperClassName,
  rows = 3,
  required,
  helpText,
  ...props
}) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const errorId = error ? `${textareaId}-error` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-none"
        >
          {label}
          {required && (
            <span className="ml-1 text-danger-500" aria-hidden="true">*</span>
          )}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          BASE,
          error
            ? 'border-danger-400 focus:ring-danger-500/30 focus:border-danger-500 dark:border-danger-500'
            : 'border-neutral-300 dark:border-neutral-600',
          className
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        required={required}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{helpText}</p>
      )}
    </div>
  )
}

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helpText: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
}
