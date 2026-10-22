import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../components/features/auth/AuthContext.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { ProductsTable } from '../components/features/products/ProductsTable.jsx'
import { ProductForm } from '../components/features/products/ProductForm.jsx'
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx'
import { productsService } from '../services/productsService.js'
import { canDeleteProduct } from '../components/features/products/productRules.js'
import { USER_ROLE } from '../constants/statuses.js'

export default function ProductsPage() {
  const { products, orders, loading, errors, loadAll, dispatch } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const { addNotification } = useNotifications()

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const canWrite = user?.role === USER_ROLE.ADMIN

  function handleEdit(product) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  function handleAdd() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function handleDeleteRequest(product) {
    const { canDelete, reason } = canDeleteProduct(product.id, orders)
    if (!canDelete) {
      toast(reason, 'error')
      return
    }
    setDeleteTarget(product)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await productsService.delete(deleteTarget.id)
      dispatch({ type: 'DELETE_PRODUCT', id: deleteTarget.id })
      addNotification({ type: 'info', message: `Product "${deleteTarget.name}" deleted.` })
      toast(`"${deleteTarget.name}" deleted.`, 'success')
      setDeleteTarget(null)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Products" description="Manage your product catalog and inventory." />
      <ProductsTable
        products={products}
        isLoading={loading.products}
        error={errors.products}
        onRetry={loadAll}
        canWrite={canWrite}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />
      {canWrite && (
        <ProductForm
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          product={editingProduct}
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete product?"
        description={`"${deleteTarget?.name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
      />
    </div>
  )
}
