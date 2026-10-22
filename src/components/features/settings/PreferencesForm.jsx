import { useState, useEffect } from 'react'
import { useData } from '../../../context/DataContext.jsx'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { useToast } from '../../ui/Toast.jsx'
import { Select } from '../../ui/Select.jsx'
import { Input } from '../../ui/Input.jsx'
import { Button } from '../../ui/Button.jsx'
import { Card } from '../../ui/Card.jsx'

export function PreferencesForm() {
  const { settings, saveSettings } = useData()
  const { theme, setTheme } = useTheme()
  const toast = useToast()

  const [taxRate, setTaxRate] = useState(String((settings?.taxRate ?? 0.08) * 100))
  const [threshold, setThreshold] = useState(String(settings?.lowStockThreshold ?? 10))
  const [currency, setCurrency] = useState(settings?.currency ?? 'USD')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      setTaxRate(String((settings.taxRate ?? 0.08) * 100))
      setThreshold(String(settings.lowStockThreshold ?? 10))
      setCurrency(settings.currency ?? 'USD')
    }
  }, [settings])

  async function handleSave(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 300))
    saveSettings({
      ...settings,
      taxRate: parseFloat(taxRate) / 100,
      lowStockThreshold: parseInt(threshold, 10),
      currency,
      theme,
    })
    toast('Preferences saved.', 'success')
    setLoading(false)
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Preferences</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-md" noValidate>
        <Select
          label="Theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="system">System default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </Select>

        <Input
          label="Tax rate (%)"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
          helpText="Applied when creating new orders."
        />

        <Input
          label="Low stock threshold"
          type="number"
          min="0"
          step="1"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          helpText="Products at or below this quantity are flagged as low stock."
        />

        <Select
          label="Currency display"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </Select>

        <div>
          <Button type="submit" loading={loading}>Save preferences</Button>
        </div>
      </form>
    </Card>
  )
}
