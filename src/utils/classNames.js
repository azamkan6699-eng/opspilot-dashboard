import { clsx } from 'clsx'

/**
 * Thin wrapper around clsx for conditional class name assembly.
 * Keeps imports consistent across the codebase.
 */
export function cn(...inputs) {
  return clsx(...inputs)
}
