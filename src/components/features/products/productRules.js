import { STOCK_STATUS } from '../../../constants/statuses.js'
import { ORDER_STATUS } from '../../../constants/statuses.js'

/**
 * Derive the stock status of a product.
 * @param {{ stock: number, reorderThreshold: number }} product
 * @returns {string} one of STOCK_STATUS values
 */
export function getStockStatus(product) {
  if (product.stock === 0) return STOCK_STATUS.OUT_OF_STOCK
  if (product.stock <= product.reorderThreshold) return STOCK_STATUS.LOW_STOCK
  return STOCK_STATUS.IN_STOCK
}

/**
 * Badge variant for stock status.
 * @param {string} status
 * @returns {'success'|'warning'|'danger'}
 */
export function stockStatusVariant(status) {
  switch (status) {
    case STOCK_STATUS.IN_STOCK: return 'success'
    case STOCK_STATUS.LOW_STOCK: return 'warning'
    case STOCK_STATUS.OUT_OF_STOCK: return 'danger'
    default: return 'neutral'
  }
}

/**
 * Check if a product can be safely deleted.
 * A product is blocked if it appears in any non-cancelled order.
 *
 * @param {string} productId
 * @param {Array<{status: string, items: Array<{productId: string}>}>} orders
 * @returns {{ canDelete: boolean, reason?: string }}
 */
export function canDeleteProduct(productId, orders) {
  const activeOrders = orders.filter(
    (o) =>
      o.status !== ORDER_STATUS.CANCELLED &&
      o.items.some((item) => item.productId === productId)
  )
  if (activeOrders.length > 0) {
    return {
      canDelete: false,
      reason: `This product appears in ${activeOrders.length} active order${activeOrders.length > 1 ? 's' : ''} and cannot be deleted.`,
    }
  }
  return { canDelete: true }
}

/**
 * Validate product form data.
 * @param {object} data
 * @param {Array<{id: string, sku: string}>} allProducts - For SKU uniqueness check
 * @param {string|null} editingId - ID of product being edited (null = creating)
 * @returns {Record<string, string>} errors map (empty = valid)
 */
export function validateProductForm(data, allProducts, editingId = null) {
  const errors = {}
  if (!data.name?.trim()) errors.name = 'Product name is required.'
  if (!data.sku?.trim()) {
    errors.sku = 'SKU is required.'
  } else if (
    allProducts.some(
      (p) => p.id !== editingId && p.sku.toLowerCase() === data.sku.toLowerCase()
    )
  ) {
    errors.sku = 'This SKU is already in use.'
  }
  if (!data.category?.trim()) errors.category = 'Category is required.'
  if (!data.price || Number(data.price) <= 0) errors.price = 'Price must be greater than 0.'
  if (data.stock === '' || data.stock === undefined || !Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) {
    errors.stock = 'Stock must be a non-negative whole number.'
  }
  if (data.reorderThreshold === '' || data.reorderThreshold === undefined || Number(data.reorderThreshold) < 0) {
    errors.reorderThreshold = 'Reorder threshold must be 0 or more.'
  }
  return errors
}
