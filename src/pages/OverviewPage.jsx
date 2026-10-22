import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { subDays } from 'date-fns'
import { useData } from '../context/DataContext.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { StatCard } from '../components/common/StatCard.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { ChartCard } from '../components/charts/ChartCard.jsx'
import { RevenueChart } from '../components/charts/RevenueChart.jsx'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { calcKPIs, revenueOverTime } from '../components/features/analytics/analyticsSelectors.js'
import { getStockStatus } from '../components/features/products/productRules.js'
import { orderStatusVariant } from '../components/features/orders/orderRules.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { formatDate } from '../utils/formatDate.js'
import { orderDetailPath, ROUTES } from '../constants/routes.js'
import { STOCK_STATUS } from '../constants/statuses.js'
import {
  DollarSign, ShoppingCart, TrendingUp, AlertTriangle,
} from 'lucide-react'

export default function OverviewPage() {
  const { orders, products, settings, loading } = useData()
  const currency = settings?.currency ?? 'USD'
  const isLoading = loading.orders || loading.products

  const periodEnd = useMemo(() => new Date(), [])
  const periodStart = useMemo(() => subDays(periodEnd, 29), [periodEnd])

  const kpis = useMemo(
    () => (isLoading ? null : calcKPIs(orders, periodStart, periodEnd, products)),
    [orders, products, periodStart, periodEnd, isLoading]
  )

  const chartData = useMemo(
    () => (isLoading ? [] : revenueOverTime(orders, periodStart, periodEnd)),
    [orders, periodStart, periodEnd, isLoading]
  )

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [orders]
  )

  const lowStockProducts = useMemo(
    () => products.filter((p) => getStockStatus(p) !== STOCK_STATUS.IN_STOCK).slice(0, 5),
    [products]
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Overview" description="Your business at a glance for the last 30 days." />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(kpis.revenue, currency)}
              change={kpis.changes.revenue}
              changeLabel="vs prev. period"
              icon={DollarSign}
            />
            <StatCard
              title="Total Orders"
              value={String(kpis.orders)}
              change={kpis.changes.orders}
              changeLabel="vs prev. period"
              icon={ShoppingCart}
            />
            <StatCard
              title="Avg. Order Value"
              value={formatCurrency(kpis.avgOrderValue, currency)}
              change={kpis.changes.avgOrderValue}
              changeLabel="vs prev. period"
              icon={TrendingUp}
            />
            <StatCard
              title="Low Stock Items"
              value={String(kpis.lowStockCount)}
              icon={AlertTriangle}
              iconColor="bg-warning-100 dark:bg-warning-900/20"
            />
          </>
        )}
      </div>

      {/* Revenue chart */}
      <ChartCard
        title="Revenue Trend"
        description="Daily revenue for the last 30 days"
        isLoading={isLoading}
        isEmpty={!isLoading && chartData.every((d) => d.revenue === 0)}
      >
        <RevenueChart data={chartData} />
      </ChartCard>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <Card padding={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Recent Orders</h2>
            <Link
              to={ROUTES.ORDERS}
              className="text-xs text-primary-600 hover:underline dark:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  to={orderDetailPath(order.id)}
                  className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <div>
                    <p className="text-sm font-mono font-medium text-primary-600 dark:text-primary-400">{order.id}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={orderStatusVariant(order.status)} dot>{order.status}</Badge>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {formatCurrency(order.total, currency)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* Low stock alert */}
        <Card padding={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Low Stock Alerts</h2>
            <Link
              to={ROUTES.PRODUCTS}
              className="text-xs text-primary-600 hover:underline dark:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              Manage inventory
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              All products are well-stocked.
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
              {lowStockProducts.map((product) => {
                const status = getStockStatus(product)
                return (
                  <li key={product.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{product.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{product.sku}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={status === STOCK_STATUS.OUT_OF_STOCK ? 'danger' : 'warning'} dot>
                        {status === STOCK_STATUS.OUT_OF_STOCK ? 'Out of stock' : `${product.stock} left`}
                      </Badge>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
