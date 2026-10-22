import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../components/features/auth/AuthContext.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { CustomersTable } from '../components/features/customers/CustomersTable.jsx'
import { CustomerForm } from '../components/features/customers/CustomerForm.jsx'
import { USER_ROLE } from '../constants/statuses.js'

export default function CustomersPage() {
  const { customers, orders, loading, errors, loadAll } = useData()
  const { user } = useAuth()
  const [formOpen, setFormOpen] = useState(false)
  const canWrite = user?.role === USER_ROLE.ADMIN

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Customers" description="View and manage your customer base." />
      <CustomersTable
        customers={customers}
        orders={orders}
        isLoading={loading.customers}
        error={errors.customers}
        onRetry={loadAll}
        canWrite={canWrite}
        onAdd={() => setFormOpen(true)}
      />
      {canWrite && (
        <CustomerForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
      )}
    </div>
  )
}
