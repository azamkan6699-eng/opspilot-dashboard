import { useState, useCallback } from 'react'

/**
 * useState backed by localStorage. Falls back to initialValue if the key
 * doesn't exist or parsing fails.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const next = value instanceof Function ? value(storedValue) : value
        setStoredValue(next)
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // ignore write errors (quota, private mode)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}
