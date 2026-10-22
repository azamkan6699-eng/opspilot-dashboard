import PropTypes from 'prop-types'
import { AlertCircle } from 'lucide-react'
import { Button } from './Button.jsx'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-900/30">
        <AlertCircle className="h-6 w-6 text-danger-600 dark:text-danger-400" aria-hidden="true" />
      </div>
      <div>
        <p className="font-medium text-neutral-800 dark:text-neutral-200">{title}</p>
        {message && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{message}</p>}
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

ErrorState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
}
