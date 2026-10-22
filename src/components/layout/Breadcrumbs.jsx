import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ChevronRight } from 'lucide-react'

/**
 * @param {Array<{label: string, to?: string}>} crumbs
 */
export function Breadcrumbs({ crumbs }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm" role="list">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
              )}
              {isLast || !crumb.to ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="text-neutral-500 dark:text-neutral-400"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded dark:text-primary-400"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

Breadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, to: PropTypes.string })
  ).isRequired,
}
