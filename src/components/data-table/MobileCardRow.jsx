import PropTypes from 'prop-types'
import { cn } from '../../utils/classNames.js'

/**
 * Renders a single data row as a stacked card for mobile viewports.
 * Receives the column definitions and row data from DataTable.
 */
export function MobileCardRow({ columns, row, onRowClick, rowClassName }) {
  // First column is treated as the card title
  const [titleCol, ...restCols] = columns.filter((c) => !c.mobileHide)

  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800',
        onRowClick && 'cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 transition-colors',
        rowClassName
      )}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      role={onRowClick ? 'button' : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(row) } } : undefined}
    >
      {/* Title row */}
      {titleCol && (
        <div className="mb-3 font-medium text-neutral-900 dark:text-neutral-100">
          {titleCol.cell ? titleCol.cell(row) : row[titleCol.key]}
        </div>
      )}
      {/* Attribute grid */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        {restCols.map((col) => (
          <div key={col.key} className="flex flex-col">
            <dt className="text-xs text-neutral-500 dark:text-neutral-400">{col.label}</dt>
            <dd className="text-sm text-neutral-800 dark:text-neutral-200">
              {col.cell ? col.cell(row) : (row[col.key] ?? '—')}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

MobileCardRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  row: PropTypes.object.isRequired,
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.string,
}
