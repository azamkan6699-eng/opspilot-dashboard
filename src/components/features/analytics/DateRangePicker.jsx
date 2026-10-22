import { useState } from 'react'
import PropTypes from 'prop-types'
import { subDays, format } from 'date-fns'
import { Button } from '../../ui/Button.jsx'
import { Input } from '../../ui/Input.jsx'
import { cn } from '../../../utils/classNames.js'

const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
]

export function DateRangePicker({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  function applyPreset(days) {
    const end = new Date()
    const start = subDays(end, days - 1)
    setShowCustom(false)
    onChange({ start, end, label: `Last ${days} days` })
  }

  function applyCustom() {
    if (!customFrom || !customTo) return
    onChange({ start: new Date(customFrom), end: new Date(customTo), label: 'Custom' })
    setShowCustom(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((p) => (
        <Button
          key={p.days}
          variant={value.label === p.label ? 'primary' : 'outline'}
          size="sm"
          onClick={() => applyPreset(p.days)}
          className={cn(value.label === p.label ? '' : '')}
        >
          {p.label}
        </Button>
      ))}
      <Button
        variant={value.label === 'Custom' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setShowCustom((v) => !v)}
      >
        Custom
      </Button>
      {showCustom && (
        <div className="flex items-end gap-2 mt-2 w-full sm:w-auto sm:mt-0">
          <Input type="date" label="From" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="w-36" />
          <Input type="date" label="To" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="w-36" />
          <Button size="sm" onClick={applyCustom} disabled={!customFrom || !customTo} className="self-end">Apply</Button>
        </div>
      )}
      {value.start && (
        <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2 hidden sm:inline">
          {format(value.start, 'MMM d')} – {format(value.end, 'MMM d, yyyy')}
        </span>
      )}
    </div>
  )
}

DateRangePicker.propTypes = {
  value: PropTypes.shape({ start: PropTypes.instanceOf(Date), end: PropTypes.instanceOf(Date), label: PropTypes.string }).isRequired,
  onChange: PropTypes.func.isRequired,
}
