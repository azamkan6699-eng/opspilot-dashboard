import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../components/features/auth/AuthContext.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { Breadcrumbs } from '../components/layout/Breadcrumbs.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { CustomerForm } from '../components/features/customers/CustomerForm.jsx'
import { ErrorState } from '../components/ui/ErrorState.jsx'
import { computeCustomerStats, getCustomerSegment, segmentVariant } from '../components/features/customers/customerRules.js'
import { orderStatusVariant } from '../components/features/orders/orderRules.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { formatDate } from '../utils/formatDate.js'
import { ROUTES, orderDetailPath } from '../constants/routes.js'
import { USER_ROLE } from '../constants/statuses.js'
import { Link } from 'react-router-dom'

export default function CustomerDetailPage() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const { customers, orders, settings } = useData()
  const { user } = useAuth()
  const [editOpen, setEditOpen] = useState(false)
  const currency = settings?.currency ?? 'USD'
  const canWrite = user?.role === USER_ROLE.ADMIN

  const customer = customers.find((c) => c.id === customerId)
  const customerOrders = useMemo(
    () => orders.filter((o) => o.customerId === customerId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders, customerId]
  )
  const stats = useMemo(() => computeCustomerStats(customerOrders), [customerOrders])
  const segment = customer ? getCustomerSegment(stats.lifetimeValue, stats.orderCount) : null

  if (!customer) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumbs crumbs={[{ label: 'Customers', to: ROUTES.CUSTOMERS }, { label: customerId }]} />
        <ErrorState title="Customer not found" onRetry={() => navigate(ROUTES.CUSTOMERS)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs crumbs={[{ label: 'Customers', to: ROUTES.CUSTOMERS }, { label: customer.name }]} />
      <PageHeader
        title={customer.name}
        description={customer.email}
        actions={
          canWrite && (
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>Edit customer</Button>
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Segment</p>
          <Badge variant={segmentVariant(segment)}>{segment}</Badge>
        </Card>
        <Card>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Total Orders</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{stats.orderCount}</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Lifetime Value</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{formatCurrency(stats.lifetimeValue, currency)}</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Avg. Order Value</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{formatCurrency(stats.averageOrderValue, currency)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Profile</h2>
          <dl className="flex flex-col gap-3 text-sm">
            {[
              ['Name', customer.name],
              ['Email', customer.email],
              ['Phone', customer.phone || '—'],
              ['City', customer.city],
              ['Country', customer.country],
              ['Member since', formatDate(customer.createdAt)],
              ['First order', stats.firstOrderDate ? formatDate(stats.firstOrderDate) : '—'],
              ['Last order', stats.lastOrderDate ? formatDate(stats.lastOrderDate) : '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">{label}</dt>
                <dd className="text-neutral-900 dark:text-neutral-100 text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Order history */}
        <Card padding={false} className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Order History</h2>
          </div>
          {customerOrders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-100 dark:divide-neutral-700/50">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60">
                  <tr>
                    {['Order ID', 'Date', 'Status', 'Total'].map((h) => (
                      <th key={h} scope="col" className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white dark:divide-neutral-700/50 dark:bg-neutral-800">
                  {customerOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
                      <td className="px-5 py-3 text-sm">
                        <Link to={orderDetailPath(order.id)} className="font-mono font-medium text-primary-600 dark:text-primary-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm text-neutral-600 dark:text-neutral-400">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-3 text-sm">
                        <Badge variant={orderStatusVariant(order.status)} dot>{order.status}</Badge>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium">{formatCurrency(order.total, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {canWrite && (
        <CustomerForm isOpen={editOpen} onClose={() => setEditOpen(false)} customer={customer} />
      )}
    </div>
  )
}
