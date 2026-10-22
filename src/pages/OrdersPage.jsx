import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../components/features/auth/AuthContext.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { OrdersTable } from '../components/features/orders/OrdersTable.jsx'
import { OrderForm } from '../components/features/orders/OrderForm.jsx'
import { USER_ROLE } from '../constants/statuses.js'

export default function OrdersPage() {
  const { orders, customers, loading, errors, loadAll } = useData()
  const { user } = useAuth()
  const [createOpen, setCreateOpen] = useState(false)
  const canCreate = user?.role === USER_ROLE.ADMIN

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Orders" description="Manage and track all customer orders." />
      <OrdersTable
        orders={orders}
        customers={customers}
        isLoading={loading.orders}
        error={errors.orders}
        onRetry={loadAll}
        canCreate={canCreate}
        onCreateClick={() => setCreateOpen(true)}
      />
      {canCreate && (
        <OrderForm isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      )}
    </div>
  )
}
