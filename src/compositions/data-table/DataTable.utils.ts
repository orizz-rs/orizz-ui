import { isValidElement, type ReactNode } from 'react'
import type {
  DataTableColumn,
  DataTableSortState,
} from './DataTable.types'

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})

export function getDataTableValue<T extends object>(
  row: T,
  column: DataTableColumn<T>,
): unknown {
  if (column.accessor === undefined) return undefined
  return row[column.accessor]
}

export function formatDataTableValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === '') return '—'
  if (isValidElement(value)) return value
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return value.toLocaleDateString()
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value === 'bigint') return value.toString()
  return String(value)
}

export function extractDataTableText(value: unknown): string {
  if (value === null || value === undefined || typeof value === 'boolean') return ''
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint'
  ) return String(value)
  if (Array.isArray(value)) {
    return value.map(extractDataTableText).filter(Boolean).join(' ')
  }
  if (isValidElement(value)) {
    const props: unknown = value.props
    if (typeof props === 'object' && props !== null && 'children' in props) {
      return extractDataTableText(props.children)
    }
  }
  return ''
}

export function filterDataTableRows<T extends object>(
  rows: readonly T[],
  columns: readonly DataTableColumn<T>[],
  filters: Readonly<Record<string, string>>,
): readonly T[] {
  const activeColumns = columns.filter((column) => {
    const value = filters[column.id]
    return column.filter !== undefined && value !== undefined && value.trim() !== ''
  })
  if (activeColumns.length === 0) return rows

  return rows.filter((row) =>
    activeColumns.every((column) => {
      const query = filters[column.id]?.trim().toLocaleLowerCase() ?? ''
      const value = column.filterValue?.(row) ?? getDataTableValue(row, column)
      const normalizedValue = String(value ?? '').toLocaleLowerCase()
      return column.filter?.type === 'select'
        ? normalizedValue === query
        : normalizedValue.includes(query)
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
