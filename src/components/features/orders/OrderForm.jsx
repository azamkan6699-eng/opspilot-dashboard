import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '../../ui/Modal.jsx'
import { Button } from '../../ui/Button.jsx'
import { Select } from '../../ui/Select.jsx'
import { Input } from '../../ui/Input.jsx'
import { Textarea } from '../../ui/Textarea.jsx'
import { useData } from '../../../context/DataContext.jsx'
import { useToast } from '../../ui/Toast.jsx'
import { useNotifications } from '../../../context/NotificationContext.jsx'
import { ordersService } from '../../../services/ordersService.js'
import { storage } from '../../../services/storage.js'
import { formatCurrency } from '../../../utils/formatCurrency.js'
import { calculateOrderTotals } from './orderRules.js'

export function OrderForm({ isOpen, onClose, onCreated }) {
  const { customers, products, dispatch, settings, refreshProducts } = useData()
  const toast = useToast()
  const { addNotification } = useNotifications()
  const taxRate = settings?.taxRate ?? 0.08
  const currency = settings?.currency ?? 'USD'

  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const productMap = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products])

  const enrichedItems = items.map((item) => ({
    ...item,
    product: productMap[item.productId] || null,
    unitPrice: productMap[item.productId]?.price || 0,
  }))

  const { subtotal, tax, total } = useMemo(
    () =>
      calculateOrderTotals(
        enrichedItems.filter((i) => i.product).map((i) => ({ unitPrice: i.unitPrice, quantity: i.quantity })),
        taxRate
      ),
    [enrichedItems, taxRate]
  )

  function addItem() {
    setItems((prev) => [...prev, { productId: '', quantity: 1 }])
  }

  function removeItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateItem(idx, patch) {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)))
  }

  function validate() {
    const errs = {}
    if (!customerId) errs.customerId = 'Select a customer.'
    if (items.length === 0) { errs.items = 'Add at least one item.'; return errs }
    items.forEach((item, idx) => {
      if (!item.productId) errs[`item_${idx}_product`] = 'Select a product.'
      const product = productMap[item.productId]
      if (product && (item.quantity < 1 || !Number.isInteger(Number(item.quantity)))) {
        errs[`item_${idx}_qty`] = 'Quantity must be at least 1.'
      }
      if (product && item.quantity > product.stock) {
        errs[`item_${idx}_qty`] = `Only ${product.stock} in stock.`
      }
    })
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const customer = customers.find((c) => c.id === customerId)
      const orderItems = enrichedItems
        .filter((i) => i.product)
        .map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          quantity: Number(i.quantity),
          unitPrice: i.unitPrice,
        }))
      const order = await ordersService.create({ customerId, items: orderItems, taxRate, notes })
      dispatch({ type: 'ADD_ORDER', order })
      // Reload products from storage since stock was decremented inside the service
      dispatch({ type: 'REFRESH_PRODUCTS', products: storage.getProducts() })
      addNotification({ type: 'info', message: `New order ${order.id} created for ${customer?.name}.` })
      toast(`Order ${order.id} created successfully.`, 'success')
      onCreated?.(order)
      handleClose()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setCustomerId('')
    setItems([{ productId: '', quantity: 1 }])
    setNotes('')
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Order" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Select
          label="Customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          error={errors.customerId}
          required
        >
          <option value="">Select customer…</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
          ))}
        </Select>

        {/* Line items */}
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Items <span className="text-danger-500" aria-hidden="true">*</span>
          </p>
          <div className="flex flex-col gap-2">
            {items.map((item, idx) => {
              const product = productMap[item.productId]
              return (
                <div key={idx} className="flex items-start gap-2">
                  <Select
                    value={item.productId}
                    onChange={(e) => updateItem(idx, { productId: e.target.value, quantity: 1 })}
                    error={errors[`item_${idx}_product`]}
                    wrapperClassName="flex-1"
                    aria-label={`Product for item ${idx + 1}`}
                  >
                    <option value="">Select product…</option>
                    {products.filter((p) => p.stock > 0).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatCurrency(p.price, currency)} (stock: {p.stock})
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    max={product?.stock ?? undefined}
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                    error={errors[`item_${idx}_qty`]}
                    wrapperClassName="w-20 shrink-0"
                    aria-label={`Quantity for item ${idx + 1}`}
                  />
                  {product && (
                    <p className="mt-2 min-w-[4.5rem] shrink-0 text-right text-sm text-neutral-600 dark:text-neutral-400">
                      {formatCurrency(product.price * item.quantity, currency)}
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(idx)}
                    disabled={items.length === 1}
                    aria-label={`Remove item ${idx + 1}`}
                    className="mt-1 shrink-0 text-danger-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
          {errors.items && <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{errors.items}</p>}
          <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2 gap-1">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add item
          </Button>
        </div>

        {/* Totals */}
        <div className="rounded-lg bg-neutral-50 p-4 text-sm dark:bg-neutral-700/30">
          <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
            <span>Subtotal</span><span>{formatCurrency(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
            <span>Tax ({(taxRate * 100).toFixed(0)}%)</span><span>{formatCurrency(tax, currency)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-semibold text-neutral-900 dark:border-neutral-600 dark:text-neutral-100">
            <span>Total</span><span>{formatCurrency(total, currency)}</span>
          </div>
        </div>

        <Textarea
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Any special instructions…"
        />

        <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-700">
          <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Create Order</Button>
        </div>
      </form>
    </Modal>
  )
}

OrderForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func,
}
