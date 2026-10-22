/** Order status constants and valid transitions */
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const PAYMENT_STATUS = {
  PAID: 'Paid',
  PENDING: 'Pending',
  REFUNDED: 'Refunded',
  FAILED: 'Failed',
}

/**
 * Valid forward transitions for order status.
 * Only statuses listed here can be transitioned to from the key status.
 */
export const ORDER_STATUS_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
}

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
}

export const CUSTOMER_SEGMENT = {
  VIP: 'VIP',
  REGULAR: 'Regular',
  NEW: 'New',
}

export const USER_ROLE = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
}
