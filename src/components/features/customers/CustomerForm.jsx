import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../../ui/Modal.jsx'
import { Button } from '../../ui/Button.jsx'
import { Input } from '../../ui/Input.jsx'
import { useData } from '../../../context/DataContext.jsx'
import { useToast } from '../../ui/Toast.jsx'
import { customersService } from '../../../services/customersService.js'
import { validateCustomerForm } from './customerRules.js'

const EMPTY = { name: '', email: '', phone: '', city: '', country: 'US' }

export function CustomerForm({ isOpen, onClose, customer, onSaved }) {
  const { customers, dispatch } = useData()
  const toast = useToast()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (customer) {
      setForm({ name: customer.name ?? '', email: customer.email ?? '', phone: customer.phone ?? '', city: customer.city ?? '', country: customer.country ?? 'US' })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [customer, isOpen])

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validateCustomerForm(form, customers, customer?.id ?? null)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      if (customer) {
        const updated = await customersService.update(customer.id, form)
        dispatch({ type: 'UPDATE_CUSTOMER', customer: updated })
        toast(`"${updated.name}" updated.`, 'success')
      } else {
        const created = await customersService.create(form)
        dispatch({ type: 'ADD_CUSTOMER', customer: created })
        toast(`"${created.name}" added.`, 'success')
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
    <Modal isOpen={isOpen} onClose={onClose} title={customer ? 'Edit Customer' : 'Add Customer'} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input label="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} required />
        <Input label="Email address" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} required />
        <Input label="Phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 000-0000" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="City" value={form.city} onChange={(e) => set('city', e.target.value)} error={errors.city} required />
          <Input label="Country" value={form.country} onChange={(e) => set('country', e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-700">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{customer ? 'Save changes' : 'Add customer'}</Button>
        </div>
      </form>
    </Modal>
  )
}

CustomerForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customer: PropTypes.object,
  onSaved: PropTypes.func,
}
