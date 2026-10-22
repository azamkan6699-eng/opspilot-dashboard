import PropTypes from 'prop-types'
import { Card } from '../ui/Card.jsx'
import { Skeleton } from '../ui/Skeleton.jsx'
import { EmptyState } from '../ui/EmptyState.jsx'
import { BarChart2 } from 'lucide-react'

export function ChartCard({ title, description, isLoading, isEmpty, children, className }) {
  return (
    <Card className={className} padding={false}>
      <div className="px-5 pt-5 pb-2">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
        {description && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-5 pb-5">
        {isLoading ? (
          <div className="h-56">
            <Skeleton className="h-full w-full rounded" />
          </div>
        ) : isEmpty ? (
          <EmptyState icon={BarChart2} title="No data" description="No data available for this period." className="py-10" />
        ) : (
          children
        )}
      </div>
    </Card>
  )
}

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  isLoading: PropTypes.bool,
  isEmpty: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
}
