import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../../ui/Modal.jsx'
import { Button } from '../../ui/Button.jsx'
import { Input } from '../../ui/Input.jsx'
import { Select } from '../../ui/Select.jsx'
import { useData } from '../../../context/DataContext.jsx'
import { useToast } from '../../ui/Toast.jsx'
import { productsService } from '../../../services/productsService.js'
import { validateProductForm } from './productRules.js'

const CATEGORIES = ['Electronics', 'Apparel', 'Home & Kitchen', 'Sports & Outdoors', 'Books & Stationery', 'Health & Beauty']

const EMPTY = { name: '', sku: '', category: '', price: '', stock: '', reorderThreshold: '', imageUrl: '' }

export function ProductForm({ isOpen, onClose, product, onSaved }) {
  const { products, dispatch } = useData()
  const toast = useToast()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? '',
        sku: product.sku ?? '',
        category: product.category ?? '',
        price: product.price ?? '',
        stock: product.stock ?? '',
        reorderThreshold: product.reorderThreshold ?? '',
        imageUrl: product.imageUrl ?? '',
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [product, isOpen])

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validateProductForm(form, products, product?.id ?? null)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        reorderThreshold: Number(form.reorderThreshold),
        imageUrl: form.imageUrl || null,
      }
      if (product) {
        const updated = await productsService.update(product.id, payload)
        dispatch({ type: 'UPDATE_PRODUCT', product: updated })
        toast(`"${updated.name}" updated.`, 'success')
      } else {
        const created = await productsService.create(payload)
        dispatch({ type: 'ADD_PRODUCT', product: created })
        toast(`"${created.name}" added to inventory.`, 'success')
      }
      onSaved?.()
      onClose()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input label="Product name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="SKU" value={form.sku} onChange={(e) => set('sku', e.target.value)} error={errors.sku} required placeholder="ELC-XXX-001" />
          <Select label="Category" value={form.category} onChange={(e) => set('category', e.target.value)} error={errors.category} required>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="Price ($)" type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} error={errors.price} required />
          <Input label="Stock" type="number" min="0" step="1" value={form.stock} onChange={(e) => set('stock', e.target.value)} error={errors.stock} required />
          <Input label="Reorder threshold" type="number" min="0" step="1" value={form.reorderThreshold} onChange={(e) => set('reorderThreshold', e.target.value)} error={errors.reorderThreshold} required />
        </div>
        <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-700">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{product ? 'Save changes' : 'Add product'}</Button>
        </div>
      </form>
    </Modal>
  )
}

ProductForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onSaved: PropTypes.func,
}
