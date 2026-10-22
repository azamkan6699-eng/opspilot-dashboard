import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { useQueryParams } from '../../../hooks/useQueryParams.js'
import { useSort } from '../../../hooks/useSort.js'
import { usePagination } from '../../../hooks/usePagination.js'
import { useDebounce } from '../../../hooks/useDebounce.js'
import { DataTable } from '../../data-table/DataTable.jsx'
import { TableToolbar } from '../../data-table/TableToolbar.jsx'
import { OrderFilters } from './OrderFilters.jsx'
import { SearchInput } from '../../ui/SearchInput.jsx'
import { Badge } from '../../ui/Badge.jsx'
import { Button } from '../../ui/Button.jsx'
import { EmptyState } from '../../ui/EmptyState.jsx'
import { orderStatusVariant } from './orderRules.js'
import { formatCurrency } from '../../../utils/formatCurrency.js'
import { formatDate } from '../../../utils/formatDate.js'
import { exportToCsv } from '../../../utils/csv.js'
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '../../../constants/businessRules.js'
import { orderDetailPath } from '../../../constants/routes.js'
import { Download, ShoppingCart } from 'lucide-react'

const DEFAULTS = { q: '', status: '', paymentStatus: '', dateFrom: '', dateTo: '', sort: 'createdAt', dir: 'desc', page: 1, pageSize: DEFAULT_PAGE_SIZE }

const CSV_COLUMNS = [
  { key: 'id', label: 'Order ID' },
  { key: 'customerId', label: 'Customer ID' },
  { key: 'status', label: 'Status' },
  { key: 'paymentStatus', label: 'Payment' },
  { key: 'total', label: 'Total' },
  { key: 'createdAt', label: 'Date' },
]

export function OrdersTable({ orders, customers, isLoading, error, onRetry, canCreate, onCreateClick }) {
  const navigate = useNavigate()
  const [params, setParams] = useQueryParams(DEFAULTS)

  const customerMap = useMemo(() => Object.fromEntries(customers.map((c) => [c.id, c])), [customers])

  const debouncedQ = useDebounce(params.q, SEARCH_DEBOUNCE_MS)

  // Enrich orders with customer name for search/sort
  const enriched = useMemo(() =>
    orders.map((o) => ({ ...o, customerName: customerMap[o.customerId]?.name ?? '' })),
  [orders, customerMap])

  // Filter
  const filtered = useMemo(() => {
    return enriched.filter((o) => {
      if (debouncedQ) {
        const q = debouncedQ.toLowerCase()
        if (!o.id.toLowerCase().includes(q) && !o.customerName.toLowerCase().includes(q)) return false
      }
      if (params.status && o.status !== params.status) return false
      if (params.paymentStatus && o.paymentStatus !== params.paymentStatus) return false
      if (params.dateFrom) {
        try {
          if (!isWithinInterval(parseISO(o.createdAt), { start: startOfDay(parseISO(params.dateFrom)), end: endOfDay(params.dateTo ? parseISO(params.dateTo) : new Date('9999-12-31')) })) return false
        } catch { return false }
      }
      if (params.dateTo && !params.dateFrom) {
        try {
          if (parseISO(o.createdAt) > endOfDay(parseISO(params.dateTo))) return false
        } catch { return false }
      }
      return true
    })
  }, [enriched, debouncedQ, params.status, params.paymentStatus, params.dateFrom, params.dateTo])

  // Sort
  function handleSort(key) {
    setParams({ sort: key, dir: params.sort === key && params.dir === 'asc' ? 'desc' : 'asc', page: 1 })
  }
  const { sortedItems } = useSort(filtered, params.sort, params.dir, handleSort)

  // Paginate
  const pagination = usePagination(sortedItems, params.page, params.pageSize)

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true, cell: (row) => <span className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">{row.id}</span> },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'createdAt', label: 'Date', sortable: true, cell: (row) => formatDate(row.createdAt) },
    { key: 'status', label: 'Status', cell: (row) => <Badge variant={orderStatusVariant(row.status)} dot>{row.status}</Badge> },
    { key: 'paymentStatus', label: 'Payment', cell: (row) => (
      <Badge variant={row.paymentStatus === 'Paid' ? 'success' : row.paymentStatus === 'Refunded' ? 'info' : row.paymentStatus === 'Failed' ? 'danger' : 'neutral'}>{row.paymentStatus}</Badge>
    )},
    { key: 'total', label: 'Total', sortable: true, cell: (row) => <span className="font-medium">{formatCurrency(row.total)}</span>, cellClassName: 'text-right', headerClassName: 'text-right' },
  ]

  function handleClearFilters() {
    setParams({ q: '', status: '', paymentStatus: '', dateFrom: '', dateTo: '', page: 1 })
  }

  function handleExport() {
    exportToCsv(sortedItems, CSV_COLUMNS, 'orders.csv')
  }

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        search={
          <SearchInput
            value={params.q}
            onChange={(v) => setParams({ q: v, page: 1 })}
            placeholder="Search order ID or customer…"
            label="Search orders"
          />
        }
        filters={
          <OrderFilters
            filters={{ status: params.status, paymentStatus: params.paymentStatus, dateFrom: params.dateFrom, dateTo: params.dateTo }}
            onChange={(patch) => setParams({ ...patch, page: 1 })}
            onClear={handleClearFilters}
          />
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={sortedItems.length === 0} aria-label="Export to CSV">
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </Button>
            {canCreate && (
              <Button size="sm" onClick={onCreateClick}>
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                New Order
              </Button>
            )}
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={pagination.paginatedItems}
        rowKey="id"
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        caption="Orders list"
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
        onRowClick={(row) => navigate(orderDetailPath(row.id))}
        emptyState={
          <EmptyState
            icon={ShoppingCart}
            title="No orders found"
            description="Try adjusting your search or clearing filters."
            action={<Button variant="secondary" size="sm" onClick={handleClearFilters}>Clear filters</Button>}
          />
        }
      />
    </div>
  )
}

OrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  canCreate: PropTypes.bool,
  onCreateClick: PropTypes.func,
}
