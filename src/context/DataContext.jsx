import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { productsService } from '../services/productsService.js'
import { customersService } from '../services/customersService.js'
import { ordersService } from '../services/ordersService.js'
import { storage } from '../services/storage.js'

const DataContext = createContext(null)

const initialState = {
  products: [],
  customers: [],
  orders: [],
  settings: null,
  loading: { products: false, customers: false, orders: false },
  errors: { products: null, customers: null, orders: null },
  initialized: false,
}

function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.key]: true }, errors: { ...state.errors, [action.key]: null } }
    case 'SET_DATA':
      return { ...state, [action.key]: action.data, loading: { ...state.loading, [action.key]: false } }
    case 'SET_ERROR':
      return { ...state, loading: { ...state.loading, [action.key]: false }, errors: { ...state.errors, [action.key]: action.error } }
    case 'SET_INITIALIZED':
      return { ...state, initialized: true }
    case 'SET_SETTINGS':
      return { ...state, settings: action.settings }
    // Optimistic updates for products
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.product] }
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map((p) => p.id === action.product.id ? action.product : p) }
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter((p) => p.id !== action.id) }
    // Customers
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.customer] }
    case 'UPDATE_CUSTOMER':
      return { ...state, customers: state.customers.map((c) => c.id === action.customer.id ? action.customer : c) }
    case 'DELETE_CUSTOMER':
      return { ...state, customers: state.customers.filter((c) => c.id !== action.id) }
    // Orders
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.order] }
    case 'UPDATE_ORDER':
      return { ...state, orders: state.orders.map((o) => o.id === action.order.id ? action.order : o) }
    case 'DELETE_ORDER':
      return { ...state, orders: state.orders.filter((o) => o.id !== action.id) }
    // Refresh stock after status changes (cancel restores stock)
    case 'REFRESH_PRODUCTS':
      return { ...state, products: action.products }
    default:
      return state
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState)

  const loadAll = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', key: 'products' })
    dispatch({ type: 'SET_LOADING', key: 'customers' })
    dispatch({ type: 'SET_LOADING', key: 'orders' })
    const [products, customers, orders] = await Promise.all([
      productsService.getAll().catch(() => []),
      customersService.getAll().catch(() => []),
      ordersService.getAll().catch(() => []),
    ])
    dispatch({ type: 'SET_DATA', key: 'products', data: products })
    dispatch({ type: 'SET_DATA', key: 'customers', data: customers })
    dispatch({ type: 'SET_DATA', key: 'orders', data: orders })
    dispatch({ type: 'SET_SETTINGS', settings: storage.getSettings() })
    dispatch({ type: 'SET_INITIALIZED' })
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  const refreshProducts = useCallback(() => {
    dispatch({ type: 'REFRESH_PRODUCTS', products: storage.getProducts() })
  }, [])

  const saveSettings = useCallback((settings) => {
    storage.setSettings(settings)
    dispatch({ type: 'SET_SETTINGS', settings })
  }, [])

  return (
    <DataContext.Provider value={{ ...state, dispatch, loadAll, refreshProducts, saveSettings }}>
      {children}
    </DataContext.Provider>
  )
}

DataProvider.propTypes = { children: PropTypes.node.isRequired }

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
