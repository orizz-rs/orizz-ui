import {
  useId,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react'
import type {
  DataTableColumn,
  DataTableProps,
  DataTableSortState,
} from './DataTable.types'
import {
  filterDataTableRows,
  formatDataTableValue,
  getDataTableValue,
  sortDataTableRows,
} from './DataTable.utils'
import {
  hasBlockingValidationIssue,
  validateDataTable,
} from './DataTable.validation'
import { DataTableHeader } from './DataTableHeader'
import { useDataTableSetup } from './useDataTableSetup'
import styles from './DataTable.module.css'

function getNextSort(
  columnId: string,
  current: DataTableSortState | null,
): DataTableSortState | null {
  if (current?.columnId !== columnId) {
    return { columnId, direction: 'asc' }
  }
  if (current.direction === 'asc') {
    return { columnId, direction: 'desc' }
  }
  return null
}

function renderCell<T extends object>(
  row: T,
  column: DataTableColumn<T>,
): ReactNode {
  return column.cell?.(row) ?? formatDataTableValue(getDataTableValue(row, column))
}

export function DataTable<T extends object>({
  columns,
  data,
  getRowId,
  caption = 'Data table',
  emptyMessage = 'No matching data found.',
  showFilters = true,
  validate = true,
  initialSort,
  className,
  ...divProps
}: DataTableProps<T>): JSX.Element {
  const filterIdPrefix = useId()
  const [filters, setFilters] = useState<Readonly<Record<string, string>>>({})
  const [sort, setSort] = useState<DataTableSortState | null>(initialSort ?? null)
  const { resolvedColumns, resolveRowId } = useDataTableSetup(
    columns,
    data,
    getRowId,
  )
  const issues = useMemo(
    () => (validate ? validateDataTable(resolvedColumns, data, resolveRowId) : []),
    [data, resolveRowId, resolvedColumns, validate],
  )
  const isBlocked = hasBlockingValidationIssue(issues)
  const visibleRows = useMemo(() => {
    const filteredRows = filterDataTableRows(data, resolvedColumns, filters)
    return sortDataTableRows(filteredRows, resolvedColumns, sort)
  }, [data, filters, resolvedColumns, sort])

  const handleFilterChange = (columnId: string, value: string): void => {
    setFilters((current) => ({ ...current, [columnId]: value }))
  }

  const handleSort = (columnId: string): void => {
    setSort((current) => getNextSort(columnId, current))
  }

  return (
    <div {...divProps} className={[styles.root, className].filter(Boolean).join(' ')}>
      {issues.length > 0 ? (
        <div className={styles.validation} role="alert">
          <strong>Table data needs attention</strong>
          <ul>
            {issues.map((issue) => <li key={issue.id}>{issue.message}</li>)}
          </ul>
        </div>
      ) : null}

      {!isBlocked ? (
        <div className={styles.toolbar}>
          <span className={styles.count} aria-live="polite">
            {visibleRows.length} of {data.length} rows
          </span>
        </div>
      ) : null}

      {!isBlocked ? (
        <div className={styles.scroller}>
          <table className={styles.table}>
            <caption className={styles.visuallyHidden}>{caption}</caption>
            <DataTableHeader
              columns={resolvedColumns}
              filterIdPrefix={filterIdPrefix}
              filters={filters}
              showFilters={showFilters}
              sort={sort}
              onFilterChange={handleFilterChange}
              onSort={handleSort}
            />
            <tbody>
              {visibleRows.length > 0 ? visibleRows.map((row) => (
                <tr key={resolveRowId(row)}>
                  {resolvedColumns.map((column) => (
                    <td key={column.id} data-align={column.align ?? 'start'}>
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                  <td
                    className={styles.empty}
                    colSpan={Math.max(resolvedColumns.length, 1)}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
