import PropTypes from 'prop-types'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '../../utils/classNames.js'

export function SortableHeader({ label, sortKey, currentSortKey, currentSortDir, onSort }) {
  const isActive = currentSortKey === sortKey
  return (
    <th
      scope="col"
      aria-sort={isActive ? (currentSortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className="px-4 py-3 text-left"
    >
      <button
        onClick={() => onSort(sortKey)}
        className={cn(
          'inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded',
          isActive
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
        )}
      >
        {label}
        {isActive ? (
          currentSortDir === 'asc'
            ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
        )}
      </button>
    </th>
  )
}

SortableHeader.propTypes = {
  label: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired,
  currentSortKey: PropTypes.string,
  currentSortDir: PropTypes.oneOf(['asc', 'desc']),
  onSort: PropTypes.func.isRequired,
}
