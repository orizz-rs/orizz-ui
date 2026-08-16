import type { ReactNode } from 'react'
import type {
  DataTableColumn,
  DataTableSortState,
  DataTableValidationIssue,
} from './DataTable.types'

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})

function isMissingValue(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  )
}

function findDuplicates(values: readonly string[]): readonly string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  values.forEach((value) => {
    if (seen.has(value)) duplicates.add(value)
    seen.add(value)
  })

  return [...duplicates]
}

export function getDataTableValue<T extends object>(
  row: T,
  column: DataTableColumn<T>,
): unknown {
  if (column.accessor === undefined) return undefined
  return row[column.accessor]
}

export function formatDataTableValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return value.toLocaleDateString()
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value === 'bigint') return value.toString()
  return String(value)
}

export function filterDataTableRows<T extends object>(
  rows: readonly T[],
  columns: readonly DataTableColumn<T>[],
  query: string,
): readonly T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return rows

  const searchableColumns = columns.filter(
    (column) =>
      column.filterable !== false &&
      (column.filterValue !== undefined || column.accessor !== undefined),
  )

  return rows.filter((row) =>
    searchableColumns.some((column) => {
      const value = column.filterValue?.(row) ?? getDataTableValue(row, column)
      return String(value ?? '').toLocaleLowerCase().includes(normalizedQuery)
    }),
  )
}

function compareValues(left: unknown, right: unknown): number {
  if (left === right) return 0
  if (left === null || left === undefined) return 1
  if (right === null || right === undefined) return -1
  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime()
  }
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }
  return collator.compare(String(left), String(right))
}

export function sortDataTableRows<T extends object>(
  rows: readonly T[],
  columns: readonly DataTableColumn<T>[],
  sort: DataTableSortState | null,
): readonly T[] {
  if (!sort) return rows
  const column = columns.find(
    (candidate) => candidate.id === sort.columnId && candidate.sortable,
  )
  if (!column) return rows

  const direction = sort.direction === 'asc' ? 1 : -1
  return [...rows].sort((left, right) => {
    const comparison = column.compare
      ? column.compare(left, right)
      : compareValues(
          column.sortValue?.(left) ?? getDataTableValue(left, column),
          column.sortValue?.(right) ?? getDataTableValue(right, column),
        )
    return comparison * direction
  })
}

export function validateDataTable<T extends object>(
  columns: readonly DataTableColumn<T>[],
  data: readonly T[],
  getRowId: (row: T) => string,
): readonly DataTableValidationIssue[] {
  const issues: DataTableValidationIssue[] = []
  const duplicateColumnIds = findDuplicates(columns.map((column) => column.id))

  duplicateColumnIds.forEach((columnId) => {
    issues.push({
      id: `duplicate-column-id:${columnId}`,
      code: 'duplicate-column-id',
      columnId,
      message: `Column ID "${columnId}" is duplicated.`,
    })
  })

  columns.forEach((column) => {
    if (column.header === null || column.header === undefined || column.header === '') {
      issues.push({
        id: `missing-column-header:${column.id}`,
        code: 'missing-column-header',
        columnId: column.id,
        message: `Column "${column.id}" is missing its header.`,
      })
    }
    if (column.accessor === undefined && column.cell === undefined) {
      issues.push({
        id: `missing-column-source:${column.id}`,
        code: 'missing-column-source',
        columnId: column.id,
        message: `Column "${column.id}" needs an accessor or cell renderer.`,
      })
    }
  })

  const rowIds = data.map(getRowId)
  const missingRowIdCount = rowIds.filter((rowId) => !rowId.trim()).length
  if (missingRowIdCount > 0) {
    issues.push({
      id: 'missing-row-id',
      code: 'missing-row-id',
      message: `${missingRowIdCount} row(s) are missing a stable row ID.`,
    })
  }

  findDuplicates(rowIds.filter(Boolean)).forEach((rowId) => {
    issues.push({
      id: `duplicate-row-id:${rowId}`,
      code: 'duplicate-row-id',
      message: `Row ID "${rowId}" is duplicated.`,
    })
  })

  columns.forEach((column) => {
    const shouldValidate = column.required ?? column.accessor !== undefined
    if (!shouldValidate || column.accessor === undefined) return

    const missingRowIds = data
      .filter((row) => isMissingValue(getDataTableValue(row, column)))
      .map(getRowId)
      .filter(Boolean)
    const unidentifiedCount = data.filter(
      (row) =>
        isMissingValue(getDataTableValue(row, column)) && !getRowId(row).trim(),
    ).length

    if (missingRowIds.length > 0 || unidentifiedCount > 0) {
      const identifiedRows = missingRowIds.length > 0 ? missingRowIds.join(', ') : 'none'
      const unidentified = unidentifiedCount > 0
        ? `; ${unidentifiedCount} unidentified row(s)`
        : ''
      issues.push({
        id: `missing-required-value:${column.id}`,
        code: 'missing-required-value',
        columnId: column.id,
        message: `Column "${column.id}" is missing required values in rows: ${identifiedRows}${unidentified}.`,
      })
    }
  })

  return issues
}

export function hasBlockingValidationIssue(
  issues: readonly DataTableValidationIssue[],
): boolean {
  return issues.some((issue) => issue.code !== 'missing-required-value')
}
