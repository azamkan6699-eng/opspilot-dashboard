import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Read and write URL search params with typed defaults.
 * Keeps table state (search, filters, sort, page) in the URL so
 * sharing a link or refreshing preserves the exact view.
 *
 * @param {Record<string, string|number>} defaults
 */
export function useQueryParams(defaults = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo(() => {
    const result = { ...defaults }
    for (const [key, defaultVal] of Object.entries(defaults)) {
      const raw = searchParams.get(key)
      if (raw !== null) {
        result[key] = typeof defaultVal === 'number' ? Number(raw) : raw
      }
    }
    return result
  }, [searchParams, defaults])

  const setParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === undefined || value === '' || value === defaults[key]) {
            next.delete(key)
          } else {
            next.set(key, String(value))
          }
        }
        return next
      }, { replace: true })
    },
    [setSearchParams, defaults]
  )

  return [params, setParams]
}
