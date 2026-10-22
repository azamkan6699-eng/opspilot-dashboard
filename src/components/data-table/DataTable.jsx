import PropTypes from 'prop-types'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { SortableHeader } from './SortableHeader.jsx'
import { MobileCardRow } from './MobileCardRow.jsx'
import { Pagination } from '../ui/Pagination.jsx'
import { EmptyState } from '../ui/EmptyState.jsx'
import { ErrorState } from '../ui/ErrorState.jsx'
import { SkeletonTable } from '../ui/Skeleton.jsx'
import { cn } from '../../utils/classNames.js'

/**
 * One reusable DataTable that powers Orders, Products, and Customers.
 *
 * Column definition shape:
 *   { key, label, sortable?, cell?(row), headerClassName?, cellClassName?, mobileHide? }
 */
export function DataTable({
  columns,
  rows,
  rowKey = 'id',
  isLoading = false,
  error = null,
  onRetry,
  emptyState,
  sortKey,
  sortDir,
  onSort,
  currentPage,
  totalPages,
  totalItems,
  from,
  to,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  rowClassName,
  caption,
}) {
  const isMobile = useMediaQuery('(max-width: 639px)')

  if (isLoading) return <SkeletonTable rows={8} cols={columns.length} />
  if (error)     return <ErrorState message={error} onRetry={onRetry} />

  if (rows.length === 0) {
    return emptyState ?? <EmptyState title="No results found" description="Try adjusting your search or filters." />
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <MobileCardRow
            key={row[rowKey]}
            columns={columns}
            row={row}
            onRowClick={onRowClick}
            rowClassName={rowClassName}
          />
        ))}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            from={from}
            to={to}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-neutral-50 dark:bg-neutral-800/60">
            <tr>
              {columns.map((col) =>
                col.sortable ? (
                  <SortableHeader
                    key={col.key}
                    label={col.label}
                    sortKey={col.key}
                    currentSortKey={sortKey}
                    currentSortDir={sortDir}
                    onSort={onSort}
                  />
                ) : (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400',
                      col.headerClassName
                    )}
                  >
                    {col.label}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white dark:divide-neutral-700/50 dark:bg-neutral-800">
            {rows.map((row) => (
              <tr
                key={row[rowKey]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/40',
                  rowClassName
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-sm text-neutral-800 dark:text-neutral-200',
                      col.cellClassName
                    )}
                  >
                    {col.cell ? col.cell(row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages >= 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          from={from}
          to={to}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  )
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowKey: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  emptyState: PropTypes.node,
  sortKey: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
  onSort: PropTypes.func,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  totalItems: PropTypes.number,
  from: PropTypes.number,
  to: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.string,
  caption: PropTypes.string,
}
