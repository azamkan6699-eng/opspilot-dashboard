import PropTypes from 'prop-types'
import { Search, X } from 'lucide-react'
import { cn } from '../../utils/classNames.js'

export function SearchInput({ value, onChange, placeholder = 'Search…', className, id, label }) {
  const inputId = id || 'search-input'
  return (
    <div className={cn('relative', className)}>
      {label && (
        <label htmlFor={inputId} className="sr-only">{label}</label>
      )}
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        aria-hidden="true"
      />
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded border border-neutral-300 bg-white py-2 pl-9 pr-9 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        aria-label={label || placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:text-neutral-200"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
}
