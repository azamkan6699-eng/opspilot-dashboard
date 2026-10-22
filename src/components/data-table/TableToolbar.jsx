import PropTypes from 'prop-types'
import { cn } from '../../utils/classNames.js'

/**
 * Toolbar above the table: holds search, filters, and action buttons.
 * On mobile, filters collapse into a slot passed as `filtersPanel`.
 */
export function TableToolbar({ search, filters, actions, className }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Top row: search + actions */}
      <div className="flex flex-wrap items-center gap-2">
        {search && <div className="flex-1 min-w-[160px] max-w-xs">{search}</div>}
        {actions && <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {/* Filters row */}
      {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
    </div>
  )
}

TableToolbar.propTypes = {
  search: PropTypes.node,
  filters: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
}
