import { useCallback, useMemo, useRef } from 'react'
import type { DataTableColumn } from './DataTable.types'
import { createDataTableColumns } from './DataTable.auto'

interface DataTableSetup<T extends object> {
  readonly resolvedColumns: readonly DataTableColumn<T>[]
  readonly resolveRowId: (row: T) => string
}

function readPreferredId(row: object): string | null {
  for (const key of ['id', '_id', 'key']) {
    const value: unknown = Reflect.get(row, key)
    if (
      (typeof value === 'string' && value.trim()) ||
      typeof value === 'number' ||
      typeof value === 'bigint'
    ) return String(value)
  }
  return null
}

export function useDataTableSetup<T extends object>(
  columns: readonly DataTableColumn<T>[] | undefined,
  data: readonly T[],
  getRowId: ((row: T) => string) | undefined,
): DataTableSetup<T> {
  const identities = useRef(new WeakMap<object, string>())
  const nextIdentity = useRef(0)
  const resolvedColumns = useMemo(
    () => columns ?? createDataTableColumns(data),
    [columns, data],
  )
  const resolveRowId = useCallback((row: T): string => {
    if (getRowId) return getRowId(row)
    const existing = identities.current.get(row)
    if (existing) return existing
    nextIdentity.current += 1
    const preferred = readPreferredId(row)
    const generated = preferred
      ? `auto-row-${preferred}-${nextIdentity.current}`
      : `auto-row-${nextIdentity.current}`
    identities.current.set(row, generated)
    return generated
  }, [getRowId])

  return { resolvedColumns, resolveRowId }
}
