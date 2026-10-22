import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { Header } from './Header.jsx'
import { MobileDrawer } from './MobileDrawer.jsx'

const SIDEBAR_W      = 256 // 16rem — matches w-sidebar token
const SIDEBAR_ICON_W = 72  // 4.5rem — collapsed / tablet icon-only

export function AppLayout() {
  // On desktop: fully expanded by default; user can collapse to icon rail
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sidebarWidth = collapsed ? SIDEBAR_ICON_W : SIDEBAR_W

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Accessibility: skip nav link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
      >
        Skip to content
      </a>

      {/* Sidebar — desktop only (lg+) */}
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />

      {/* Mobile off-canvas drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Top header — offset to match sidebar on desktop */}
      <Header
        onMenuClick={() => setDrawerOpen(true)}
        sidebarWidth={sidebarWidth}
      />

      {/*
       * Main content area.
       * On mobile/tablet (<lg): full width, top padding for header only.
       * On desktop (lg+): left margin equals sidebar width, transitions when sidebar collapses.
       */}
      <main
        id="main-content"
        tabIndex={-1}
        className="pt-[3.75rem] outline-none transition-[margin] duration-200 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* On screens below lg the sidebar is hidden so we reset the margin */}
        <style>{`@media (max-width: 1023px) { #main-content { margin-left: 0 !important; } }`}</style>

        <div className="min-h-[calc(100vh-3.75rem)] px-4 py-6 sm:px-6 lg:px-8 max-w-screen-2xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
