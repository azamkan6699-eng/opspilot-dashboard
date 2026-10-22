import { useState, useEffect } from 'react'

/**
 * Delay a value update until after the specified wait period.
 * @template T
 * @param {T} value
 * @param {number} delay ms
 * @returns {T}
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
