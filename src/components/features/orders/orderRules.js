import { ORDER_STATUS, ORDER_STATUS_TRANSITIONS } from '../../../constants/statuses.js'

/**
 * Determine whether an order's status can move to newStatus.
 * @param {string} currentStatus
 * @param {string} newStatus
 * @returns {boolean}
 */
export function canTransitionTo(currentStatus, newStatus) {
  const allowed = ORDER_STATUS_TRANSITIONS[currentStatus]
  return Array.isArray(allowed) && allowed.includes(newStatus)
}

/**
 * Return the list of valid next statuses for a given current status.
 * Returns an empty array when the order is locked (Delivered or Cancelled).
 * @param {string} currentStatus
 * @returns {string[]}
 */
export function getValidTransitions(currentStatus) {
  return ORDER_STATUS_TRANSITIONS[currentStatus] ?? []
}

/**
 * Whether an order is in a terminal (locked) state.
 * @param {string} status
 * @returns {boolean}
 */
export function isOrderLocked(status) {
  return status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.CANCELLED
}

/**
 * Calculate order totals from line items.
 * @param {Array<{unitPrice: number, quantity: number}>} items
 * @param {number} taxRate e.g. 0.08
 * @returns {{ subtotal: number, tax: number, total: number }}
 */
export function calculateOrderTotals(items, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const subtotalRounded = Math.round(subtotal * 100) / 100
  const tax = Math.round(subtotalRounded * taxRate * 100) / 100
  const total = Math.round((subtotalRounded + tax) * 100) / 100
  return { subtotal: subtotalRounded, tax, total }
}

/**
 * Return a human-readable status badge colour key.
 * @param {string} status
 * @returns {'success'|'warning'|'info'|'danger'|'neutral'}
 */
export function orderStatusVariant(status) {
  switch (status) {
    case ORDER_STATUS.DELIVERED: return 'success'
    case ORDER_STATUS.SHIPPED: return 'info'
    case ORDER_STATUS.PROCESSING: return 'warning'
    case ORDER_STATUS.PENDING: return 'neutral'
    case ORDER_STATUS.CANCELLED: return 'danger'
    default: return 'neutral'
  }
}
