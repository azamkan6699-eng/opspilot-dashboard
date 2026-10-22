import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns'

/**
 * Format an ISO date string for display.
 * @param {string} isoString
 * @param {string} [fmt='MMM d, yyyy']
 */
export function formatDate(isoString, fmt = 'MMM d, yyyy') {
  if (!isoString) return '—'
  const date = typeof isoString === 'string' ? parseISO(isoString) : isoString
  if (!isValid(date)) return '—'
  return format(date, fmt)
}

/**
 * Format an ISO date string with time.
 */
export function formatDateTime(isoString) {
  return formatDate(isoString, 'MMM d, yyyy h:mm a')
}

/**
 * Return a relative time string ("2 hours ago").
 */
export function formatRelative(isoString) {
  if (!isoString) return '—'
  const date = typeof isoString === 'string' ? parseISO(isoString) : isoString
  if (!isValid(date)) return '—'
  return formatDistanceToNow(date, { addSuffix: true })
}
