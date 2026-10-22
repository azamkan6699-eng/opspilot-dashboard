import { useEffect } from 'react'

/**
 * Call handler when a click/touch occurs outside the referenced element.
 * @param {React.RefObject} ref
 * @param {() => void} handler
 * @param {boolean} [enabled=true]
 */
export function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, enabled])
}
