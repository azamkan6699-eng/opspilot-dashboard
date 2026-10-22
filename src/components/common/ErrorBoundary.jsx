import { Component } from 'react'
import PropTypes from 'prop-types'
import { AlertCircle } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-900/30">
            <AlertCircle className="h-8 w-8 text-danger-600 dark:text-danger-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Something went wrong</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              An unexpected error occurred. Reload the page to try again.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = { children: PropTypes.node.isRequired }
