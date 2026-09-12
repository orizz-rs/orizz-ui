import type { ResultColumn } from './ResultsGrid.types'

/**
 * Pure value helpers for the results grid: cell formatting, numeric detection
 * and row comparison. No React, no DOM.
 */

export type ResultRow = Readonly<Record<string, unknown>>

export interface FormattedCell {
  readonly text: string
  readonly isNull: boolean
}

export function formatCellValue(value: unknown): FormattedCell {
  if (value === null || value === undefined) return { text: 'NULL', isNull: true }
  if (value instanceof Date) return { text: value.toISOString(), isNull: false }
  if (typeof value === 'boolean') return { text: value ? 'true' : 'false', isNull: false }
  if (typeof value === 'number') return { text: String(value), isNull: false }
  if (typeof value === 'bigint') return { text: value.toString(), isNull: false }
  if (typeof value === 'string') return { text: value, isNull: false }
  return { text: JSON.stringify(value), isNull: false }
}

const NUMERIC_DB_TYPES = new Set([
  'bigint',
  'decimal',
  'double',
  'double precision',
  'float',
  'float4',
  'float8',
  'int',
  'int2',
  'int4',
  'int8',
  'integer',
  'money',
  'numeric',
  'real',
  'serial',
  'smallint',
  'smallserial',
  'tinyint',
  'bigserial',
  'number',
  'dec',
])

function normalizeDbType(dbType: string): string {
  return dbType.replace(/\(.*$/, '').trim().toLowerCase()
}

export function isNumericColumn(column: ResultColumn, sample: unknown): boolean {
  if (typeof sample === 'number' || typeof sample === 'bigint') return true
  if (typeof sample === 'boolean' || sample instanceof Date) return false
  if (column.dbType !== undefined) {
    return NUMERIC_DB_TYPES.has(normalizeDbType(column.dbType))
  }
  return false
}

export function findNonNullSample(
  rows: readonly ResultRow[],
  columnId: string,
): unknown {
  for (const row of rows) {
    const value = row[columnId]
    if (value !== null && value !== undefined) return value
  }
  return undefined
}

export function compareGridValues(left: unknown, right: unknown): number {
  const leftNull = left === null || left === undefined
  const rightNull = right === null || right === undefined
  if (leftNull && rightNull) return 0
  if (leftNull) return -1
  if (rightNull) return 1
  if (typeof left === 'number' && typeof right === 'number') return left - right
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return left < right ? -1 : left > right ? 1 : 0
  }
  if (typeof left === 'boolean' && typeof right === 'boolean') {
    return Number(left) - Number(right)
  }
  return String(left).localeCompare(String(right))
}