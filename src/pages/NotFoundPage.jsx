import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'
import { BarChart2 } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center bg-neutral-50 dark:bg-neutral-950">
      <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-600 shadow-md">
        <BarChart2 className="h-8 w-8 text-white" aria-hidden="true" />
      </span>
      <div>
        <p className="text-6xl font-bold text-neutral-900 dark:text-neutral-100">404</p>
        <h1 className="mt-2 text-xl font-semibold text-neutral-700 dark:text-neutral-300">Page not found</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        to={ROUTES.OVERVIEW}
        className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
      >
        Go to Overview
      </Link>
    </div>
  )
}
