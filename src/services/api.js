import { SERVICE_DELAY_MIN, SERVICE_DELAY_MAX } from '../constants/businessRules.js'

/**
 * Set to true to randomly fail requests (10% chance) so error states
 * can be demonstrated. Disabled by default.
 */
const SIMULATE_FAILURES = false

/** Returns a promise that resolves after a random delay in the configured range. */
export function delay() {
  const ms = Math.floor(Math.random() * (SERVICE_DELAY_MAX - SERVICE_DELAY_MIN + 1)) + SERVICE_DELAY_MIN
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Wrap a service call with simulated network delay and optional random failure.
 * @template T
 * @param {() => T} fn - Synchronous function performing the actual work
 * @returns {Promise<T>}
 */
export async function withDelay(fn) {
  await delay()
  if (SIMULATE_FAILURES && Math.random() < 0.1) {
    throw new Error('Simulated network error. Please try again.')
  }
  return fn()
}
