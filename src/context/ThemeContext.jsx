import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

const ThemeContext = createContext(null)

/**
 * Manages light/dark/system theme.
 * Persists choice in localStorage; defaults to system preference.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem('opspilot_theme') || 'system'
    } catch {
      return 'system'
    }
  })

  const applyTheme = useCallback((choice) => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = choice === 'dark' || (choice === 'system' && prefersDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  useEffect(() => {
    applyTheme(theme)
    // Re-apply when system preference changes (only matters for 'system' mode)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme(theme)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, applyTheme])

  const setTheme = useCallback((choice) => {
    setThemeState(choice)
    try { localStorage.setItem('opspilot_theme', choice) } catch { /* ignore */ }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = { children: PropTypes.node.isRequired }

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
