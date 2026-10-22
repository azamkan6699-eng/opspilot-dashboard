import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../components/features/auth/AuthContext.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { Breadcrumbs } from '../components/layout/Breadcrumbs.jsx'
import { StatusTimeline } from '../components/common/StatusTimeline.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx'
import { ErrorState } from '../components/ui/ErrorState.jsx'
import { Skeleton } from '../components/ui/Skeleton.jsx'
import { ordersService } from '../services/ordersService.js'
import { getValidTransitions, orderStatusVariant, isOrderLocked } from '../components/features/orders/orderRules.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { formatDate, formatDateTime } from '../utils/formatDate.js'
import { ROUTES } from '../constants/routes.js'
import { ORDER_STATUS, USER_ROLE } from '../constants/statuses.js'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders, customers, products, dispatch, settings, refreshProducts } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const { addNotification } = useNotifications()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)

  const order = orders.find((o) => o.id === orderId)
  const customer = order ? customers.find((c) => c.id === order.customerId) : null
  const currency = settings?.currency ?? 'USD'
  const canWrite = user?.role === USER_ROLE.ADMIN

  const loadOrder = useCallback(async () => {
    if (!order) {
      setError('Order not found.')
    }
  }, [order])

  useEffect(() => { loadOrder() }, [loadOrder])

  async function handleStatusChange(newStatus) {
    if (newStatus === ORDER_STATUS.CANCELLED) {
      setCancelConfirm(true)
      setPendingStatus(newStatus)
      return
    }
    await applyStatusChange(newStatus)
  }

  async function applyStatusChange(newStatus) {
    setLoading(true)
    try {
      const updated = await ordersService.updateStatus(orderId, newStatus)
      dispatch({ type: 'UPDATE_ORDER', order: updated })
      refreshProducts()
      addNotification({ type: 'info', message: `Order ${orderId} status changed to ${newStatus}.` })
      toast(`Order status updated to ${newStatus}.`, 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
      setCancelConfirm(false)
      setPendingStatus(null)
    }
  }

  if (!order) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumbs crumbs={[{ label: 'Orders', to: ROUTES.ORDERS }, { label: orderId }]} />
        <ErrorState title="Order not found" message={`No order with ID ${orderId} exists.`} onRetry={() => navigate(ROUTES.ORDERS)} />
      </div>
    )
  }

  const validTransitions = getValidTransitions(order.status)
  const locked = isOrderLocked(order.status)

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs crumbs={[{ label: 'Orders', to: ROUTES.ORDERS }, { label: order.id }]} />
      <PageHeader
        title={order.id}
        description={`Placed on ${formatDateTime(order.createdAt)}`}
        actions={
          <Badge variant={orderStatusVariant(order.status)} dot>{order.status}</Badge>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Line items */}
          <Card padding={false}>
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Order Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-100 dark:divide-neutral-700/50">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Product</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Qty</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Unit Price</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white dark:divide-neutral-700/50 dark:bg-neutral-800">
                  {order.items.map((item, i) => (
                    <tr key={`${item.productId}-${i}`}>
                      <td className="px-5 py-3 text-sm">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.productName}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.productId}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-right">{item.quantity}</td>
                      <td className="px-5 py-3 text-sm text-right">{formatCurrency(item.unitPrice, currency)}</td>
                      <td className="px-5 py-3 text-sm text-right font-medium">{formatCurrency(item.unitPrice * item.quantity, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="ml-auto max-w-xs flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span><span>{formatCurrency(order.subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Tax ({((order.taxRate ?? 0.08) * 100).toFixed(0)}%)</span>
                  <span>{formatCurrency(order.tax, currency)}</span>
                </div>
                <div className="flex justify-between font-semibold text-neutral-900 dark:text-neutral-100 border-t border-neutral-200 dark:border-neutral-700 pt-2">
                  <span>Total</span><span>{formatCurrency(order.total, currency)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Status actions */}
          {canWrite && !locked && validTransitions.length > 0 && (
            <Card>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Update Status</h2>
              <div className="flex flex-wrap gap-2">
                {validTransitions.map((status) => (
                  <Button
                    key={status}
                    variant={status === ORDER_STATUS.CANCELLED ? 'danger' : 'primary'}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    loading={loading && pendingStatus === status}
                    disabled={loading}
                  >
                    Mark as {status}
                  </Button>
                ))}
              </div>
            </Card>
          )}
          {locked && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              This order is {order.status.toLowerCase()} and cannot be modified.
            </p>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Customer info */}
          <Card>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Customer</h2>
            {customer ? (
              <div className="flex flex-col gap-1 text-sm">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{customer.name}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{customer.email}</p>
                <p className="text-neutral-500 dark:text-neutral-400">{customer.city}</p>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Customer not found.</p>
            )}
          </Card>

          {/* Order info */}
          <Card>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Order Details</h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500 dark:text-neutral-400">Payment</dt>
                <dd className="font-medium">
                  <Badge variant={order.paymentStatus === 'Paid' ? 'success' : order.paymentStatus === 'Refunded' ? 'info' : 'neutral'}>
                    {order.paymentStatus}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500 dark:text-neutral-400">Created</dt>
                <dd>{formatDate(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500 dark:text-neutral-400">Updated</dt>
                <dd>{formatDate(order.updatedAt)}</dd>
              </div>
            </dl>
          </Card>

          {/* Status timeline */}
          <Card>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Timeline</h2>
            <StatusTimeline
              status={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={cancelConfirm}
        onClose={() => { setCancelConfirm(false); setPendingStatus(null) }}
        onConfirm={() => applyStatusChange(ORDER_STATUS.CANCELLED)}
        title="Cancel this order?"
        description="Cancelling will restore reserved stock to inventory. This cannot be undone."
        confirmLabel="Cancel order"
        loading={loading}
      />
    </div>
  )
}
