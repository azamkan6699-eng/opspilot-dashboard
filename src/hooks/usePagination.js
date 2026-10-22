import { useMemo } from 'react'
import { DEFAULT_PAGE_SIZE } from '../constants/businessRules.js'

/**
 * Slice a sorted/filtered array for the current page.
 *
 * @param {Array} items - Full filtered+sorted dataset
 * @param {number} page - 1-indexed current page
 * @param {number} pageSize
 * @returns {{ paginatedItems, totalPages, totalItems, from, to }}
 */
export function usePagination(items, page, pageSize = DEFAULT_PAGE_SIZE) {
  return useMemo(() => {
    const totalItems = items.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
    const to = Math.min(safePage * pageSize, totalItems)
    const paginatedItems = items.slice((safePage - 1) * pageSize, safePage * pageSize)
    return { paginatedItems, totalPages, totalItems, from, to, currentPage: safePage }
  }, [items, page, pageSize])
}
