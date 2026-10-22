import PropTypes from 'prop-types'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/classNames.js'

const BASE = [
  'inline-flex items-center justify-center gap-2 rounded-md font-medium',
  'transition-all duration-150',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  'select-none shrink-0',
].join(' ')

const VARIANTS = {
  primary: [
    'bg-primary-600 text-white shadow-sm',
    'hover:bg-primary-700 active:bg-primary-800',
    'focus-visible:ring-primary-500',
    'dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700',
  ].join(' '),

  secondary: [
    'bg-neutral-100 text-neutral-800 shadow-sm',
    'hover:bg-neutral-200 active:bg-neutral-300',
    'focus-visible:ring-neutral-400',
    'dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600 dark:active:bg-neutral-500',
  ].join(' '),

  danger: [
    'bg-danger-600 text-white shadow-sm',
    'hover:bg-danger-700 active:bg-danger-800',
    'focus-visible:ring-danger-500',
  ].join(' '),

  ghost: [
    'bg-transparent text-neutral-600',
    'hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200',
    'focus-visible:ring-neutral-400',
    'dark:text-neutral-400 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100',
  ].join(' '),

  outline: [
    'border border-neutral-300 bg-white text-neutral-700 shadow-sm',
    'hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100',
    'focus-visible:ring-neutral-400',
    'dark:border-neutral-600 dark:bg-transparent dark:text-neutral-200',
    'dark:hover:bg-neutral-800 dark:hover:border-neutral-500',
  ].join(' '),
}

const SIZES = {
  sm:       'h-8 px-3 text-sm',
  md:       'h-9 px-4 text-sm',
  lg:       'h-10 px-5 text-sm',
  icon:     'h-9 w-9 p-0',
  'icon-sm': 'h-7 w-7 p-0',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'outline']),
  size:    PropTypes.oneOf(['sm', 'md', 'lg', 'icon', 'icon-sm']),
  loading: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}
