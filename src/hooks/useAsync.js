import { useState, useCallback, useRef } from 'react'

/**
 * Manage async operation state: loading, data, error.
 * The execute function returns the resolved value so callers can chain logic.
 *
 * @param {(...args: any[]) => Promise<any>} asyncFn
 * @param {{ immediate?: boolean }} options
 */
export function useAsync(asyncFn, { immediate = false } = {}) {
  const [status, setStatus] = useState(immediate ? 'pending' : 'idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  // Track latest call so stale responses are ignored
  const callId = useRef(0)

  const execute = useCallback(
    async (...args) => {
      const id = ++callId.current
      setStatus('pending')
      setError(null)
      try {
        const result = await asyncFn(...args)
        if (id === callId.current) {
          setData(result)
          setStatus('success')
        }
        return result
      } catch (err) {
        if (id === callId.current) {
          setError(err?.message ?? 'An unexpected error occurred.')
          setStatus('error')
        }
        throw err
      }
    },
    [asyncFn]
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setData(null)
    setError(null)
  }, [])

  return {
    execute,
    reset,
    data,
    error,
    status,
    isLoading: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle',
  }
}
