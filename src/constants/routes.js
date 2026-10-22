export const ROUTES = {
  LOGIN: '/login',
  OVERVIEW: '/',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:orderId',
  PRODUCTS: '/products',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:customerId',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
}

export const orderDetailPath = (orderId) => `/orders/${orderId}`
export const customerDetailPath = (customerId) => `/customers/${customerId}`
