import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Menu, Sun, Moon, Monitor, Search, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useClickOutside } from '../../hooks/useClickOutside.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import { NotificationMenu } from '../common/NotificationMenu.jsx'
import { UserMenu } from '../common/UserMenu.jsx'
import { orderDetailPath } from '../../constants/routes.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

const THEME_CYCLE = { light: 'dark', dark: 'system', system: 'light' }
const THEME_LABELS = { light: 'Switch to dark theme', dark: 'Switch to system theme', system: 'Switch to light theme' }

function ThemeIcon({ theme }) {
  if (theme === 'dark') return <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
  if (theme === 'light') return <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
  return <Monitor className="h-[18px] w-[18px]" aria-hidden="true" />
}

ThemeIcon.propTypes = { theme: PropTypes.string.isRequired }

export function Header({ onMenuClick, sidebarWidth }) {
  const { theme, setTheme } = useTheme()
  const { orders, products, settings } = useData()
  const navigate = useNavigate()
  const currency = settings?.currency ?? 'USD'

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 180)
  const searchRef = useRef(null)

  useClickOutside(searchRef, () => { setOpen(false); setQuery('') }, open)

  const results = debouncedQuery.trim().length >= 2
    ? [
        ...orders
          .filter((o) =>
            o.id.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
          .slice(0, 3)
          .map((o) => ({
            label: o.id,
            sub: `${o.status} · ${formatCurrency(o.total, currency)}`,
            to: orderDetailPath(o.id),
          })),
        ...products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              p.sku.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
          .slice(0, 3)
          .map((p) => ({ label: p.name, sub: p.sku, to: '/products' })),
      ]
    : []

  function handleSelect(to) {
    setOpen(false)
    setQuery('')
    navigate(to)
  }

  return (
    <header
      className="fixed right-0 top-0 z-20 flex h-[3.75rem] items-center gap-3 border-b border-neutral-200 bg-white/95 backdrop-blur-sm px-4 transition-[left] duration-200 dark:border-neutral-700/80 dark:bg-neutral-900/95"
      style={{ left: `${sidebarWidth}px` }}
    >
      {/* ── Responsive: left becomes 0 on mobile ── */}
      <style>{`@media (max-width: 1023px) { header { left: 0 !important; } }`}</style>

      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Global search */}
      <div ref={searchRef} className="relative flex-1 max-w-xs">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Search orders, products…"
            aria-label="Search orders and products"
            aria-expanded={open && results.length > 0}
            aria-haspopup="listbox"
            className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-8 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-primary-500 dark:focus:bg-neutral-700/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setOpen(false) }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600 focus-visible:outline-none dark:hover:text-neutral-200"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {open && results.length > 0 && (
          <ul
            role="listbox"
            aria-label="Search results"
            className="absolute top-full z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
          >
            {results.map((r, i) => (
              <li key={i} role="option" aria-selected="false">
                <button
                  onClick={() => handleSelect(r.to)}
                  className="flex w-full flex-col gap-0.5 px-4 py-3 text-left text-sm transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700"
                >
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{r.label}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{r.sub}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-0.5">
        <button
          onClick={() => setTheme(THEME_CYCLE[theme])}
          aria-label={THEME_LABELS[theme]}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <ThemeIcon theme={theme} />
        </button>
        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  )
}

Header.propTypes = {
  onMenuClick:   PropTypes.func.isRequired,
  sidebarWidth:  PropTypes.number.isRequired,
}
