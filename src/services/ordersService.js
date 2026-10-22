import { withDelay } from './api.js'
import { storage } from './storage.js'
import { productsService } from './productsService.js'
import { ORDER_STATUS, ORDER_STATUS_TRANSITIONS } from '../constants/statuses.js'
import { canTransitionTo } from '../components/features/orders/orderRules.js'

export const ordersService = {
  getAll: () => withDelay(() => storage.getOrders()),

  getById: (id) =>
    withDelay(() => {
      const order = storage.getOrders().find((o) => o.id === id)
      if (!order) throw new Error(`Order ${id} not found.`)
      return order
    }),

  create: (data) =>
    withDelay(() => {
      const { customerId, items, taxRate } = data
      if (!items || items.length === 0) throw new Error('An order must have at least one item.')
      const products = storage.getProducts()
      // Validate and deduct stock synchronously (within the same withDelay call)
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId)
        if (!product) throw new Error(`Product ${item.productId} not found.`)
        if (item.quantity > product.stock) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}.`)
        }
      }
      // Deduct stock
      for (const item of items) {
        productsService.adjustStock(item.productId, -item.quantity)
      }
      const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
      const tax = Math.round(subtotal * taxRate * 100) / 100
      const total = Math.round((subtotal + tax) * 100) / 100
      const orders = storage.getOrders()
      const maxId = orders.reduce((max, o) => {
        const n = parseInt(o.id.replace('ORD-', ''), 10)
        return n > max ? n : max
      }, 1000)
      const now = new Date().toISOString()
      const newOrder = {
        id: `ORD-${maxId + 1}`,
        customerId,
        items,
        subtotal: Math.round(subtotal * 100) / 100,
        tax,
        taxRate,
        total,
        status: ORDER_STATUS.PENDING,
        paymentStatus: 'Pending',
        createdAt: now,
        updatedAt: now,
        notes: data.notes || '',
      }
      storage.setOrders([...orders, newOrder])
      return newOrder
    }),

  updateStatus: (id, newStatus) =>
    withDelay(() => {
      const orders = storage.getOrders()
      const idx = orders.findIndex((o) => o.id === id)
      if (idx === -1) throw new Error(`Order ${id} not found.`)
      const order = orders[idx]
      if (!canTransitionTo(order.status, newStatus)) {
        throw new Error(
          `Cannot transition order from "${order.status}" to "${newStatus}".`
        )
      }
      // Cancelling an order restores stock
      if (newStatus === ORDER_STATUS.CANCELLED) {
        for (const item of order.items) {
          productsService.adjustStock(item.productId, item.quantity)
        }
      }
      const updated = { ...order, status: newStatus, updatedAt: new Date().toISOString() }
      const next = [...orders]
      next[idx] = updated
      storage.setOrders(next)
      return updated
    }),

  update: (id, data) =>
    withDelay(() => {
      const orders = storage.getOrders()
      const idx = orders.findIndex((o) => o.id === id)
      if (idx === -1) throw new Error(`Order ${id} not found.`)
      const updated = { ...orders[idx], ...data, id, updatedAt: new Date().toISOString() }
      const next = [...orders]
      next[idx] = updated
      storage.setOrders(next)
      return updated
    }),

  delete: (id) =>
    withDelay(() => {
      const orders = storage.getOrders()
      if (!orders.some((o) => o.id === id)) throw new Error(`Order ${id} not found.`)
      storage.setOrders(orders.filter((o) => o.id !== id))
      return true
    }),

  getValidTransitions: (status) => ORDER_STATUS_TRANSITIONS[status] ?? [],
}
