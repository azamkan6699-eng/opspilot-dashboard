import PropTypes from 'prop-types'
import { cn } from '../../utils/classNames.js'

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700">
          <Icon className="h-6 w-6 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
        </div>
      )}
      <div>
        <p className="font-medium text-neutral-700 dark:text-neutral-300">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
}
