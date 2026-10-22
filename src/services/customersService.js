import { withDelay } from './api.js'
import { storage } from './storage.js'

export const customersService = {
  getAll: () => withDelay(() => storage.getCustomers()),

  getById: (id) =>
    withDelay(() => {
      const customer = storage.getCustomers().find((c) => c.id === id)
      if (!customer) throw new Error(`Customer ${id} not found.`)
      return customer
    }),

  create: (data) =>
    withDelay(() => {
      const customers = storage.getCustomers()
      if (customers.some((c) => c.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error(`Email "${data.email}" is already registered.`)
      }
      const maxId = customers.reduce((max, c) => {
        const n = parseInt(c.id.replace('CUS-', ''), 10)
        return n > max ? n : max
      }, 0)
      const newCustomer = {
        ...data,
        id: `CUS-${String(maxId + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
      }
      storage.setCustomers([...customers, newCustomer])
      return newCustomer
    }),

  update: (id, data) =>
    withDelay(() => {
      const customers = storage.getCustomers()
      const idx = customers.findIndex((c) => c.id === id)
      if (idx === -1) throw new Error(`Customer ${id} not found.`)
      if (customers.some((c) => c.id !== id && c.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error(`Email "${data.email}" is already registered.`)
      }
      const updated = { ...customers[idx], ...data, id }
      const next = [...customers]
      next[idx] = updated
      storage.setCustomers(next)
      return updated
    }),

  delete: (id) =>
    withDelay(() => {
      const customers = storage.getCustomers()
      if (!customers.some((c) => c.id === id)) throw new Error(`Customer ${id} not found.`)
      storage.setCustomers(customers.filter((c) => c.id !== id))
      return true
    }),
}
