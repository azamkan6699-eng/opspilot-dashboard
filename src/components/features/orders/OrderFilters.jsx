import PropTypes from 'prop-types'
import { Select } from '../../ui/Select.jsx'
import { Input } from '../../ui/Input.jsx'
import { Button } from '../../ui/Button.jsx'
import { X } from 'lucide-react'
import { ORDER_STATUS, PAYMENT_STATUS } from '../../../constants/statuses.js'

const STATUS_OPTIONS = ['', ...Object.values(ORDER_STATUS)]
const PAYMENT_OPTIONS = ['', ...Object.values(PAYMENT_STATUS)]

export function OrderFilters({ filters, onChange, onClear }) {
  const hasFilters = filters.status || filters.paymentStatus || filters.dateFrom || filters.dateTo

  return (
    <div className="flex flex-wrap items-end gap-2">
      <Select
        label="Status"
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
        className="w-36"
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s || 'All statuses'}</option>
        ))}
      </Select>

      <Select
        label="Payment"
        value={filters.paymentStatus}
        onChange={(e) => onChange({ paymentStatus: e.target.value })}
        className="w-36"
        aria-label="Filter by payment status"
      >
        {PAYMENT_OPTIONS.map((s) => (
          <option key={s} value={s}>{s || 'All payments'}</option>
        ))}
      </Select>

      <Input
        label="From"
        type="date"
        value={filters.dateFrom}
        onChange={(e) => onChange({ dateFrom: e.target.value })}
        className="w-36"
        aria-label="Filter from date"
      />

      <Input
        label="To"
        type="date"
        value={filters.dateTo}
        onChange={(e) => onChange({ dateTo: e.target.value })}
        className="w-36"
        aria-label="Filter to date"
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="flex items-center gap-1.5 self-end">
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Clear
        </Button>
      )}
    </div>
  )
}

OrderFilters.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,
    paymentStatus: PropTypes.string,
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
}
