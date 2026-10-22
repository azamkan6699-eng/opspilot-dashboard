import { STORAGE_SCHEMA_VERSION } from '../constants/businessRules.js'
import { seedProducts } from '../data/products.js'
import { seedCustomers } from '../data/customers.js'
import { seedOrders } from '../data/orders.js'

const KEYS = {
  SCHEMA_VERSION: 'opspilot_schema_version',
  PRODUCTS: 'opspilot_products',
  CUSTOMERS: 'opspilot_customers',
  ORDERS: 'opspilot_orders',
  SETTINGS: 'opspilot_settings',
  AUTH: 'opspilot_auth',
  NOTIFICATIONS: 'opspilot_notifications',
}

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    // Private browsing quota exceeded — degrade gracefully
    return false
  }
}

/** Initialise localStorage with seed data on first load or schema mismatch. */
export function initStorage() {
  const storedVersion = safeRead(KEYS.SCHEMA_VERSION, 0)
  if (storedVersion !== STORAGE_SCHEMA_VERSION) {
    resetStorage()
  }
}

/** Wipe all app data and reload seed data. */
export function resetStorage() {
  safeWrite(KEYS.SCHEMA_VERSION, STORAGE_SCHEMA_VERSION)
  safeWrite(KEYS.PRODUCTS, seedProducts)
  safeWrite(KEYS.CUSTOMERS, seedCustomers)
  safeWrite(KEYS.ORDERS, seedOrders)
  safeWrite(KEYS.NOTIFICATIONS, [])
}

// --- Generic accessors ---

export const storage = {
  getProducts: () => safeRead(KEYS.PRODUCTS, seedProducts),
  setProducts: (data) => safeWrite(KEYS.PRODUCTS, data),

  getCustomers: () => safeRead(KEYS.CUSTOMERS, seedCustomers),
  setCustomers: (data) => safeWrite(KEYS.CUSTOMERS, data),

  getOrders: () => safeRead(KEYS.ORDERS, seedOrders),
  setOrders: (data) => safeWrite(KEYS.ORDERS, data),

  getSettings: () =>
    safeRead(KEYS.SETTINGS, {
      taxRate: 0.08,
      lowStockThreshold: 10,
      currency: 'USD',
      theme: 'system',
      profile: { name: 'Admin User', email: 'admin@opspilot.dev', initials: 'AU' },
    }),
  setSettings: (data) => safeWrite(KEYS.SETTINGS, data),

  getAuth: () => safeRead(KEYS.AUTH, null),
  setAuth: (data) => safeWrite(KEYS.AUTH, data),
  clearAuth: () => {
    try { localStorage.removeItem(KEYS.AUTH) } catch { /* ignore */ }
  },

  getNotifications: () => safeRead(KEYS.NOTIFICATIONS, []),
  setNotifications: (data) => safeWrite(KEYS.NOTIFICATIONS, data),
}
