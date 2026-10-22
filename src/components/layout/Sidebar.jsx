import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  LayoutDashboard, ShoppingCart, Package, Users,
  BarChart2, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '../../utils/classNames.js'
import { ROUTES } from '../../constants/routes.js'
import { Tooltip } from '../ui/Tooltip.jsx'

const NAV_ITEMS = [
  { label: 'Overview',  icon: LayoutDashboard, to: ROUTES.OVERVIEW },
  { label: 'Orders',    icon: ShoppingCart,    to: ROUTES.ORDERS },
  { label: 'Products',  icon: Package,         to: ROUTES.PRODUCTS },
  { label: 'Customers', icon: Users,           to: ROUTES.CUSTOMERS },
  { label: 'Analytics', icon: BarChart2,       to: ROUTES.ANALYTICS },
  { label: 'Settings',  icon: Settings,        to: ROUTES.SETTINGS },
]

export function Sidebar({ collapsed, onToggleCollapsed }) {
  return (
    <aside
      className={cn(
        // Hidden below lg; visible as icon rail on tablet? No — sidebar is desktop-only.
        // Tablet (640–1023) uses the mobile drawer instead.
        'hidden lg:flex flex-col fixed left-0 top-0 h-full z-30',
        'border-r border-neutral-200 bg-white',
        'dark:border-neutral-700/80 dark:bg-neutral-900',
        'transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-[4.5rem]' : 'w-64',
      )}
      aria-label="Main navigation"
    >
      {/* ── Logo ── */}
      <div
        className={cn(
          'flex h-[3.75rem] shrink-0 items-center border-b border-neutral-200 dark:border-neutral-700/80',
          collapsed ? 'justify-center px-0' : 'gap-2.5 px-4'
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
          <BarChart2 className="h-4 w-4 text-white" aria-hidden="true" />
        </span>
        {!collapsed && (
          <div>
            <span className="block text-[15px] font-semibold leading-none text-neutral-900 dark:text-neutral-100">
              OpsPilot
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-0.5">
              Dashboard
            </span>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3" aria-label="Sidebar navigation">
        {!collapsed && (
          <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Menu
          </p>
        )}
        <ul className={cn('flex flex-col gap-0.5', collapsed ? 'px-2' : 'px-3')} role="list">
          {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
            <li key={to}>
              <Tooltip content={collapsed ? label : undefined} side="right">
                <NavLink
                  to={to}
                  end={to === ROUTES.OVERVIEW}
                  aria-label={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center rounded-lg text-sm font-medium',
                      'transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      collapsed ? 'h-10 w-10 justify-center' : 'h-9 gap-3 px-3',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0',
                          isActive ? 'text-primary-600 dark:text-primary-400' : ''
                        )}
                        aria-hidden="true"
                      />
                      {!collapsed && <span>{label}</span>}
                    </>
                  )}
                </NavLink>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Collapse toggle ── */}
      <div className="shrink-0 border-t border-neutral-200 p-2 dark:border-neutral-700/80">
        <button
          onClick={onToggleCollapsed}
          className={cn(
            'flex w-full items-center rounded-lg px-3 py-2 text-sm text-neutral-500',
            'transition-colors hover:bg-neutral-100 hover:text-neutral-700',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            'dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300',
            collapsed ? 'justify-center' : 'gap-2'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4" />
            : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  collapsed:          PropTypes.bool.isRequired,
  onToggleCollapsed:  PropTypes.func.isRequired,
}
