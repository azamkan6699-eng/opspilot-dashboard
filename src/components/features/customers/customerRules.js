import { CUSTOMER_SEGMENT } from '../../../constants/statuses.js'
import {
  VIP_LIFETIME_VALUE_THRESHOLD,
  REGULAR_ORDER_COUNT_THRESHOLD,
} from '../../../constants/businessRules.js'
import { isValidEmail } from '../../../utils/validators.js'

/**
 * Derive a customer segment from their order history.
 * Segment is computed, never stored.
 *
 * Rules:
 *   - VIP:     lifetimeValue >= VIP_LIFETIME_VALUE_THRESHOLD (default $2000)
 *   - Regular: orderCount >= REGULAR_ORDER_COUNT_THRESHOLD (default 3)
 *   - New:     everything else
 *
 * @param {number} lifetimeValue
 * @param {number} orderCount
 * @returns {string}
 */
export function getCustomerSegment(lifetimeValue, orderCount) {
  if (lifetimeValue >= VIP_LIFETIME_VALUE_THRESHOLD) return CUSTOMER_SEGMENT.VIP
  if (orderCount >= REGULAR_ORDER_COUNT_THRESHOLD) return CUSTOMER_SEGMENT.REGULAR
  return CUSTOMER_SEGMENT.NEW
}

/**
 * Badge variant for customer segment.
 */
export function segmentVariant(segment) {
  switch (segment) {
    case CUSTOMER_SEGMENT.VIP: return 'warning'
    case CUSTOMER_SEGMENT.REGULAR: return 'info'
    case CUSTOMER_SEGMENT.NEW: return 'neutral'
    default: return 'neutral'
  }
}

/**
 * Compute a customer's stats from an array of their orders.
 * @param {Array} orders
 * @returns {{ orderCount, lifetimeValue, averageOrderValue, firstOrderDate, lastOrderDate }}
 */
export function computeCustomerStats(orders) {
  if (!orders || orders.length === 0) {
    return { orderCount: 0, lifetimeValue: 0, averageOrderValue: 0, firstOrderDate: null, lastOrderDate: null }
  }
  const sorted = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const lifetimeValue = orders.reduce((sum, o) => sum + o.total, 0)
  return {
    orderCount: orders.length,
    lifetimeValue: Math.round(lifetimeValue * 100) / 100,
    averageOrderValue: Math.round((lifetimeValue / orders.length) * 100) / 100,
    firstOrderDate: sorted[0].createdAt,
    lastOrderDate: sorted[sorted.length - 1].createdAt,
  }
}

/**
 * Validate customer form data.
 * @param {object} data
 * @param {Array<{id: string, email: string}>} allCustomers
 * @param {string|null} editingId
 * @returns {Record<string, string>}
 */
export function validateCustomerForm(data, allCustomers, editingId = null) {
  const errors = {}
  if (!data.name?.trim()) errors.name = 'Name is required.'
  if (!data.email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Enter a valid email address.'
  } else if (
    allCustomers.some(
      (c) => c.id !== editingId && c.email.toLowerCase() === data.email.toLowerCase()
    )
  ) {
    errors.email = 'This email is already registered.'
  }
  if (!data.city?.trim()) errors.city = 'City is required.'
  return errors
}
