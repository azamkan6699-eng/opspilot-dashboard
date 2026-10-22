import PropTypes from 'prop-types'

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:mt-0.5">{actions}</div>
      )}
    </div>
  )
}

PageHeader.propTypes = {
  title:       PropTypes.string.isRequired,
  description: PropTypes.string,
  actions:     PropTypes.node,
}
