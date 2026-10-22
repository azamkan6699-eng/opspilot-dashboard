/**
 * Convert an array of objects to a CSV string and trigger a browser download.
 *
 * @param {Array<Record<string, unknown>>} rows
 * @param {Array<{key: string, label: string}>} columns
 * @param {string} filename
 */
export function exportToCsv(rows, columns, filename = 'export.csv') {
  const header = columns.map((c) => escapeCell(c.label)).join(',')
  const body = rows
    .map((row) => columns.map((c) => escapeCell(getCellValue(row, c.key))).join(','))
    .join('\n')
  const csv = `${header}\n${body}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCell(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function getCellValue(row, key) {
  // Support dot-notation keys like "customer.name"
  return key.split('.').reduce((obj, k) => (obj != null ? obj[k] : ''), row) ?? ''
}
