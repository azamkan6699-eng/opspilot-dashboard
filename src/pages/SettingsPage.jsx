import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { ProfileForm } from '../components/features/settings/ProfileForm.jsx'
import { PreferencesForm } from '../components/features/settings/PreferencesForm.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx'
import { resetStorage } from '../services/storage.js'

export default function SettingsPage() {
  const { loadAll } = useData()
  const toast = useToast()
  const [resetConfirm, setResetConfirm] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function handleReset() {
    setResetting(true)
    await new Promise((r) => setTimeout(r, 400))
    resetStorage()
    await loadAll()
    toast('Demo data has been reset to defaults.', 'success')
    setResetting(false)
    setResetConfirm(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Manage your profile and application preferences." />

      <ProfileForm />
      <PreferencesForm />

      {/* Danger zone */}
      <Card className="border-danger-200 dark:border-danger-700/50">
        <h2 className="text-base font-semibold text-danger-700 dark:text-danger-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Reset all demo data to its original state. All orders, products, and customers will be restored from seed data. This cannot be undone.
        </p>
        <Button variant="danger" size="sm" onClick={() => setResetConfirm(true)}>
          Reset demo data
        </Button>
      </Card>

      <ConfirmDialog
        isOpen={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset demo data?"
        description="All changes will be lost and the original seed data will be restored. This cannot be undone."
        confirmLabel="Reset"
        loading={resetting}
      />
    </div>
  )
}
