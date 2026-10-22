import { useState, useEffect } from 'react'
import { useData } from '../../../context/DataContext.jsx'
import { useToast } from '../../ui/Toast.jsx'
import { Input } from '../../ui/Input.jsx'
import { Button } from '../../ui/Button.jsx'
import { Card } from '../../ui/Card.jsx'
import { isValidEmail } from '../../../utils/validators.js'

export function ProfileForm() {
  const { settings, saveSettings } = useData()
  const toast = useToast()
  const profile = settings?.profile ?? { name: '', email: '', initials: '' }

  const [form, setForm] = useState({ name: profile.name, email: profile.email })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings?.profile) {
      setForm({ name: settings.profile.name, email: settings.profile.email })
    }
  }, [settings])

  const isDirty = form.name !== profile.name || form.email !== profile.email

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const initials = form.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    saveSettings({ ...settings, profile: { ...profile, name: form.name, email: form.email, initials } })
    toast('Profile saved.', 'success')
    setLoading(false)
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md" noValidate>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-xl font-semibold text-white">
          {(settings?.profile?.initials) || '?'}
        </div>
        <Input label="Display name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} required />
        <Input label="Email address" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email} required />
        <div>
          <Button type="submit" loading={loading} disabled={!isDirty}>Save changes</Button>
        </div>
      </form>
    </Card>
  )
}
