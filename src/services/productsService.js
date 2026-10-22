import { withDelay } from './api.js'
import { storage } from './storage.js'

export const productsService = {
  /** Fetch all products */
  getAll: () => withDelay(() => storage.getProducts()),

  /** Fetch a single product by id */
  getById: (id) =>
    withDelay(() => {
      const product = storage.getProducts().find((p) => p.id === id)
      if (!product) throw new Error(`Product ${id} not found.`)
      return product
    }),

  /** Create a new product */
  create: (data) =>
    withDelay(() => {
      const products = storage.getProducts()
      if (products.some((p) => p.sku.toLowerCase() === data.sku.toLowerCase())) {
        throw new Error(`SKU "${data.sku}" is already in use.`)
      }
      const maxId = products.reduce((max, p) => {
        const n = parseInt(p.id.replace('PRD-', ''), 10)
        return n > max ? n : max
      }, 0)
      const newProduct = { ...data, id: `PRD-${String(maxId + 1).padStart(3, '0')}` }
      storage.setProducts([...products, newProduct])
      return newProduct
    }),

  /** Update an existing product */
  update: (id, data) =>
    withDelay(() => {
      const products = storage.getProducts()
      const idx = products.findIndex((p) => p.id === id)
      if (idx === -1) throw new Error(`Product ${id} not found.`)
      // SKU uniqueness check (excluding self)
      if (products.some((p) => p.id !== id && p.sku.toLowerCase() === data.sku.toLowerCase())) {
        throw new Error(`SKU "${data.sku}" is already in use.`)
      }
      const updated = { ...products[idx], ...data, id }
      const next = [...products]
      next[idx] = updated
      storage.setProducts(next)
      return updated
    }),

  /** Delete a product – caller must have verified no active orders reference it */
  delete: (id) =>
    withDelay(() => {
      const products = storage.getProducts()
      if (!products.some((p) => p.id === id)) throw new Error(`Product ${id} not found.`)
      storage.setProducts(products.filter((p) => p.id !== id))
      return true
    }),

  /** Adjust stock by delta (positive = increase, negative = decrease) */
  adjustStock: (id, delta) => {
    const products = storage.getProducts()
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error(`Product ${id} not found.`)
    const newStock = products[idx].stock + delta
    if (newStock < 0) throw new Error(`Insufficient stock for ${products[idx].name}.`)
    const next = [...products]
    next[idx] = { ...products[idx], stock: newStock }
    storage.setProducts(next)
    return next[idx]
  },
}
