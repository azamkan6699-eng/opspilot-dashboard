import { parseISO, isWithinInterval, subDays, format, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns'
import { ORDER_STATUS } from '../../../constants/statuses.js'
import { getStockStatus } from '../products/productRules.js'
import { STOCK_STATUS } from '../../../constants/statuses.js'

/**
 * Filter orders to those whose createdAt falls within [start, end].
 * @param {Array} orders
 * @param {Date} start
 * @param {Date} end
 * @returns {Array}
 */
export function filterOrdersByDateRange(orders, start, end) {
  return orders.filter((o) => {
    const d = parseISO(o.createdAt)
    return isWithinInterval(d, { start: startOfDay(start), end: endOfDay(end) })
  })
}

/**
 * Calculate KPI figures for two periods (current and previous) to derive % change.
 * @param {Array} allOrders
 * @param {Date} periodStart  start of current period
 * @param {Date} periodEnd    end of current period (today)
 * @param {Array} products    for low-stock count
 * @returns {{ revenue, orders, avgOrderValue, lowStockCount, changes }}
 */
export function calcKPIs(allOrders, periodStart, periodEnd, products) {
  const periodLength = Math.ceil((periodEnd - periodStart) / (1000 * 60 * 60 * 24))
  const prevEnd = subDays(periodStart, 1)
  const prevStart = subDays(prevEnd, periodLength - 1)

  const current = filterOrdersByDateRange(allOrders, periodStart, periodEnd).filter(
    (o) => o.status !== ORDER_STATUS.CANCELLED
  )
  const previous = filterOrdersByDateRange(allOrders, prevStart, prevEnd).filter(
    (o) => o.status !== ORDER_STATUS.CANCELLED
  )

  const revenue = (arr) => arr.reduce((s, o) => s + o.total, 0)
  const avgOV = (arr) => (arr.length ? revenue(arr) / arr.length : 0)

  const currentRevenue = revenue(current)
  const previousRevenue = revenue(previous)
  const currentOrders = current.length
  const previousOrders = previous.length
  const currentAvg = avgOV(current)
  const previousAvg = avgOV(previous)

  const pctChange = (curr, prev) =>
    prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100 * 10) / 10

  const lowStockCount = products.filter(
    (p) => getStockStatus(p) !== STOCK_STATUS.IN_STOCK
  ).length

  return {
    revenue: Math.round(currentRevenue * 100) / 100,
    orders: currentOrders,
    avgOrderValue: Math.round(currentAvg * 100) / 100,
    lowStockCount,
    changes: {
      revenue: pctChange(currentRevenue, previousRevenue),
      orders: pctChange(currentOrders, previousOrders),
      avgOrderValue: pctChange(currentAvg, previousAvg),
    },
  }
}

/**
 * Build daily revenue data for a line/area chart.
 * @param {Array} orders
 * @param {Date} start
 * @param {Date} end
 * @returns {Array<{date: string, revenue: number}>}
 */
export function revenueOverTime(orders, start, end) {
  const filtered = filterOrdersByDateRange(orders, start, end).filter(
    (o) => o.status !== ORDER_STATUS.CANCELLED
  )
  const days = eachDayOfInterval({ start, end })
  return days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const revenue = filtered
      .filter((o) => o.createdAt.startsWith(dayStr))
      .reduce((s, o) => s + o.total, 0)
    return { date: format(day, 'MMM d'), revenue: Math.round(revenue * 100) / 100 }
  })
}

/**
 * Count orders by status within the date range.
 * @param {Array} orders
 * @param {Date} start
 * @param {Date} end
 * @returns {Array<{name: string, value: number}>}
 */
export function ordersByStatus(orders, start, end) {
  const filtered = filterOrdersByDateRange(orders, start, end)
  const counts = {}
  filtered.forEach((o) => {
    counts[o.status] = (counts[o.status] || 0) + 1
  })
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

/**
 * Revenue grouped by product category within the date range.
 * @param {Array} orders
 * @param {Array} products
 * @param {Date} start
 * @param {Date} end
 * @returns {Array<{category: string, revenue: number}>}
 */
export function revenueByCategory(orders, products, start, end) {
  const filtered = filterOrdersByDateRange(orders, start, end).filter(
    (o) => o.status !== ORDER_STATUS.CANCELLED
  )
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))
  const map = {}
  filtered.forEach((o) => {
    o.items.forEach((item) => {
      const product = productMap[item.productId]
      const category = product?.category ?? 'Unknown'
      map[category] = (map[category] || 0) + item.unitPrice * item.quantity
    })
  })
  return Object.entries(map)
    .map(([category, revenue]) => ({ category, revenue: Math.round(revenue * 100) / 100 }))
    .sort((a, b) => b.revenue - a.revenue)
}

/**
 * Top 5 products by units sold within the date range.
 * @param {Array} orders
 * @param {Date} start
 * @param {Date} end
 * @returns {Array<{name: string, units: number}>}
 */
export function topProductsByUnits(orders, start, end) {
  const filtered = filterOrdersByDateRange(orders, start, end).filter(
    (o) => o.status !== ORDER_STATUS.CANCELLED
  )
  const map = {}
  filtered.forEach((o) => {
    o.items.forEach((item) => {
      if (!map[item.productId]) map[item.productId] = { name: item.productName, units: 0 }
      map[item.productId].units += item.quantity
    })
  })
  return Object.values(map)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5)
}
