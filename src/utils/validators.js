/**
 * Shared validation helpers used across feature forms and services.
 */

/** @returns {boolean} */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

/** @returns {boolean} */
export function isNonEmpty(value) {
  return String(value ?? '').trim().length > 0
}

/** @returns {boolean} */
export function isPositiveNumber(value) {
  const n = Number(value)
  return !isNaN(n) && n > 0
}

/** @returns {boolean} */
export function isNonNegativeInteger(value) {
  const n = Number(value)
  return !isNaN(n) && Number.isInteger(n) && n >= 0
}

/**
 * Validate an order form's line items.
 * @param {Array<{productId: string, quantity: number}>} items
 * @param {Array<{id: string, stock: number}>} products
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateLineItems(items, products) {
  const errors = {}
  if (!items || items.length === 0) {
    errors.items = 'At least one item is required.'
    return { valid: false, errors }
  }
  items.forEach((item, idx) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) {
      errors[`item_${idx}_product`] = 'Select a valid product.'
    } else if (!item.quantity || item.quantity < 1) {
      errors[`item_${idx}_qty`] = 'Quantity must be at least 1.'
    } else if (item.quantity > product.stock) {
      errors[`item_${idx}_qty`] = `Only ${product.stock} in stock.`
    }
  })
  return { valid: Object.keys(errors).length === 0, errors }
}
