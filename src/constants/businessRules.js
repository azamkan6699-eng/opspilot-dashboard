/**
 * Business rule thresholds. Centralised here so they can be updated
 * in one place without touching feature components.
 */

/** Lifetime value (USD) at or above which a customer is classified VIP */
export const VIP_LIFETIME_VALUE_THRESHOLD = 2000

/** Minimum number of orders for Regular segment (below = New, at or above = Regular) */
export const REGULAR_ORDER_COUNT_THRESHOLD = 3

/** Default tax rate applied to orders (can be overridden in Settings) */
export const DEFAULT_TAX_RATE = 0.08

/** Default stock level at or below which a product is flagged Low Stock */
export const DEFAULT_LOW_STOCK_THRESHOLD = 10

/** Page sizes available in all paginated tables */
export const PAGE_SIZE_OPTIONS = [10, 25, 50]

/** Default page size */
export const DEFAULT_PAGE_SIZE = 10

/** Debounce delay for search inputs (ms) */
export const SEARCH_DEBOUNCE_MS = 300

/** Simulated service delay range (ms) */
export const SERVICE_DELAY_MIN = 300
export const SERVICE_DELAY_MAX = 600

/** Current schema version – bump when seed data shape changes */
export const STORAGE_SCHEMA_VERSION = 1
