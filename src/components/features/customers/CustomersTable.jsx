import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQueryParams } from '../../../hooks/useQueryParams.js'
import { useSort } from '../../../hooks/useSort.js'
import { usePagination } from '../../../hooks/usePagination.js'
import { useDebounce } from '../../../hooks/useDebounce.js'
import { DataTable } from '../../data-table/DataTable.jsx'
import { TableToolbar } from '../../data-table/TableToolbar.jsx'
import { SearchInput } from '../../ui/SearchInput.jsx'
import { Select } from '../../ui/Select.jsx'
import { Badge } from '../../ui/Badge.jsx'
import { Button } from '../../ui/Button.jsx'
import { EmptyState } from '../../ui/EmptyState.jsx'
import { getCustomerSegment, segmentVariant, computeCustomerStats } from './customerRules.js'
import { formatCurrency } from '../../../utils/formatCurrency.js'
import { CUSTOMER_SEGMENT } from '../../../constants/statuses.js'
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '../../../constants/businessRules.js'
import { customerDetailPath } from '../../../constants/routes.js'
import { Users, Plus } from 'lucide-react'

const DEFAULTS = { q: '', segment: '', sort: 'name', dir: 'asc', page: 1, pageSize: DEFAULT_PAGE_SIZE }

export function CustomersTable({ customers, orders, isLoading, error, onRetry, canWrite, onAdd }) {
  const navigate = useNavigate()
  const [params, setParams] = useQueryParams(DEFAULTS)
  const debouncedQ = useDebounce(params.q, SEARCH_DEBOUNCE_MS)

  // Enrich each customer with computed stats
  const enriched = useMemo(() => {
    return customers.map((c) => {
      const customerOrders = orders.filter((o) => o.customerId === c.id)
      const stats = computeCustomerStats(customerOrders)
      const segment = getCustomerSegment(stats.lifetimeValue, stats.orderCount)
      return { ...c, ...stats, segment }
    })
  }, [customers, orders])

  const filtered = useMemo(() => {
    return enriched.filter((c) => {
      if (debouncedQ) {
        const q = debouncedQ.toLowerCase()
        if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
      }
      if (params.segment && c.segment !== params.segment) return false
      return true
    })
  }, [enriched, debouncedQ, params.segment])

  function handleSort(key) {
    setParams({ sort: key, dir: params.sort === key && params.dir === 'asc' ? 'desc' : 'asc', page: 1 })
  }
  const { sortedItems } = useSort(filtered, params.sort, params.dir, handleSort)
  const pagination = usePagination(sortedItems, params.page, params.pageSize)

  const columns = [
    {
      key: 'name', label: 'Customer', sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">{row.name}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{row.email}</p>
        </div>
      ),
    },
    { key: 'city', label: 'City', sortable: true },
    { key: 'orderCount', label: 'Orders', sortable: true, cell: (row) => row.orderCount, cellClassName: 'text-right', headerClassName: 'text-right' },
    { key: 'lifetimeValue', label: 'Lifetime Value', sortable: true, cell: (row) => <span className="font-medium">{formatCurrency(row.lifetimeValue)}</span>, cellClassName: 'text-right', headerClassName: 'text-right' },
    { key: 'segment', label: 'Segment', cell: (row) => <Badge variant={segmentVariant(row.segment)}>{row.segment}</Badge> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        search={<SearchInput value={params.q} onChange={(v) => setParams({ q: v, page: 1 })} placeholder="Search name or email…" label="Search customers" />}
        filters={
          <div className="flex flex-wrap gap-2">
            <Select value={params.segment} onChange={(e) => setParams({ segment: e.target.value, page: 1 })} className="w-36" aria-label="Filter by segment">
              <option value="">All segments</option>
              {Object.values(CUSTOMER_SEGMENT).map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            {(params.q || params.segment) && (
              <Button variant="ghost" size="sm" onClick={() => setParams({ q: '', segment: '', page: 1 })}>Clear</Button>
            )}
          </div>
        }
        actions={canWrite && <Button size="sm" onClick={onAdd}><Plus className="h-4 w-4" aria-hidden="true" />Add Customer</Button>}
      />
      <DataTable
        columns={columns}
        rows={pagination.paginatedItems}
        rowKey="id"
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        caption="Customers list"
        sortKey={params.sort}
        sortDir={params.dir}
        onSort={handleSort}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        from={pagination.from}
        to={pagination.to}
        pageSize={params.pageSize}
        onPageChange={(p) => setParams({ page: p })}
        onPageSizeChange={(ps) => setParams({ pageSize: ps, page: 1 })}
        onRowClick={(row) => navigate(customerDetailPath(row.id))}
        emptyState={
          <EmptyState icon={Users} title="No customers found" description="Try adjusting your search or filters."
            action={<Button variant="secondary" size="sm" onClick={() => setParams({ q: '', segment: '', page: 1 })}>Clear filters</Button>}
          />
        }
      />
    </div>
  )
}

CustomersTable.propTypes = {
  customers: PropTypes.array.isRequired,
  orders: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  canWrite: PropTypes.bool,
  onAdd: PropTypes.func,
}
