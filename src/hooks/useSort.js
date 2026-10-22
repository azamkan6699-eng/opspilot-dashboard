import { useMemo } from 'react'

/**
 * Sort an array by a given key and direction.
 * Returns the sorted array plus a toggle helper.
 *
 * @param {Array} items
 * @param {string|null} sortKey
 * @param {'asc'|'desc'} sortDir
 * @param {(key: string) => void} onSort - Callback that receives the new key;
 *   caller is responsible for toggling direction.
 * @returns {{ sortedItems, sort }}
 */
export function useSort(items, sortKey, sortDir, onSort) {
  const sortedItems = useMemo(() => {
    if (!sortKey) return items
    return [...items].sort((a, b) => {
      let aVal = getNestedValue(a, sortKey)
      let bVal = getNestedValue(b, sortKey)
      // Normalise for comparison
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [items, sortKey, sortDir])

  return { sortedItems, sort: onSort }
}

function getNestedValue(obj, key) {
  return key.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj)
}
