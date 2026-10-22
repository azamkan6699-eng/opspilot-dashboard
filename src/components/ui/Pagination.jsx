import PropTypes from 'prop-types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/classNames.js'
import { Button } from './Button.jsx'
import { Select } from './Select.jsx'
import { PAGE_SIZE_OPTIONS } from '../../constants/businessRules.js'

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  from,
  to,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}) {
  const pages = buildPageNumbers(currentPage, totalPages)

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      {/* Info + page size */}
      <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
        <span aria-live="polite" aria-atomic="true">
          {totalItems === 0
            ? 'No results'
            : `Showing ${from}–${to} of ${totalItems}`}
        </span>
        {onPageSizeChange && (
          <Select
            aria-label="Rows per page"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="w-20 py-1.5 text-xs"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </Select>
        )}
      </div>

      {/* Page buttons */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((page, i) =>
          page === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-neutral-400" aria-hidden="true">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                page === currentPage
                  ? 'bg-primary-600 font-medium text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
              )}
            >
              {page}
            </button>
          )
        )}

        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func,
  className: PropTypes.string,
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}
