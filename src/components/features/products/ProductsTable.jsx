import { useMemo } from 'react'
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
import { getStockStatus, stockStatusVariant } from './productRules.js'
import { formatCurrency } from '../../../utils/formatCurrency.js'
import { STOCK_STATUS } from '../../../constants/statuses.js'
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '../../../constants/businessRules.js'
import { Package, Plus } from 'lucide-react'

const CATEGORIES = ['Electronics', 'Apparel', 'Home & Kitchen', 'Sports & Outdoors', 'Books & Stationery', 'Health & Beauty']
const DEFAULTS = { q: '', category: '', stockStatus: '', sort: 'name', dir: 'asc', page: 1, pageSize: DEFAULT_PAGE_SIZE }

export function ProductsTable({ products, isLoading, error, onRetry, canWrite, onAdd, onEdit, onDelete }) {
  const [params, setParams] = useQueryParams(DEFAULTS)
  const debouncedQ = useDebounce(params.q, SEARCH_DEBOUNCE_MS)

  const withStatus = useMemo(
    () => products.map((p) => ({ ...p, stockStatus: getStockStatus(p) })),
    [products]
  )

  const filtered = useMemo(() => {
    return withStatus.filter((p) => {
      if (debouncedQ) {
        const q = debouncedQ.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false
      }
      if (params.category && p.category !== params.category) return false
      if (params.stockStatus && p.stockStatus !== params.stockStatus) return false
      return true
    })
  }, [withStatus, debouncedQ, params.category, params.stockStatus])

  function handleSort(key) {
    setParams({ sort: key, dir: params.sort === key && params.dir === 'asc' ? 'desc' : 'asc', page: 1 })
  }
  const { sortedItems } = useSort(filtered, params.sort, params.dir, handleSort)
  const pagination = usePagination(sortedItems, params.page, params.pageSize)

  const columns = [
    {
      key: 'name', label: 'Product', sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">{row.name}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">{row.sku}</p>
        </div>
      ),
    },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true, cell: (row) => formatCurrency(row.price), cellClassName: 'text-right', headerClassName: 'text-right' },
    { key: 'stock', label: 'Stock', sortable: true, cell: (row) => <span className="font-medium">{row.stock}</span>, cellClassName: 'text-right', headerClassName: 'text-right' },
    {
      key: 'stockStatus', label: 'Status',
      cell: (row) => <Badge variant={stockStatusVariant(row.stockStatus)}>{row.stockStatus}</Badge>,
    },
    {
      key: 'actions', label: '',
      cell: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(row) }} disabled={!canWrite}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(row) }} disabled={!canWrite} className="text-danger-600 dark:text-danger-400">Delete</Button>
        </div>
      ),
      headerClassName: 'text-right',
      mobileHide: true,
    },
  ]

  const hasFilters = params.q || params.category || params.stockStatus

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        search={
          <SearchInput value={params.q} onChange={(v) => setParams({ q: v, page: 1 })} placeholder="Search name or SKU…" label="Search products" />
        }
        filters={
          <div className="flex flex-wrap items-end gap-2">
            <Select value={params.category} onChange={(e) => setParams({ category: e.target.value, page: 1 })} className="w-44" aria-label="Filter by category">
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select value={params.stockStatus} onChange={(e) => setParams({ stockStatus: e.target.value, page: 1 })} className="w-36" aria-label="Filter by stock status">
              <option value="">All stock</option>
              {Object.values(STOCK_STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={() => setParams({ q: '', category: '', stockStatus: '', page: 1 })}>Clear</Button>
            )}
          </div>
        }
        actions={
          canWrite && (
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4" aria-hidden="true" />Add Product
            </Button>
          )
        }
      />
      <DataTable
        columns={columns}
        rows={pagination.paginatedItems}
        rowKey="id"
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        caption="Products inventory"
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
        emptyState={
          <EmptyState icon={Package} title="No products found" description="Try adjusting your search or filters."
            action={<Button variant="secondary" size="sm" onClick={() => setParams({ q: '', category: '', stockStatus: '', page: 1 })}>Clear filters</Button>}
          />
        }
      />
    </div>
  )
}

ProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  canWrite: PropTypes.bool,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}
