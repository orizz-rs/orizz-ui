import {
  useId,
  useMemo,
  useState,
  type ChangeEvent,
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
  hasBlockingValidationIssue,
  sortDataTableRows,
  validateDataTable,
} from './DataTable.utils'
import styles from './DataTable.module.css'

function getSortLabel<T extends object>(
  column: DataTableColumn<T>,
  sort: DataTableSortState | null,
): string {
  if (sort?.columnId !== column.id) return `Sort ${String(column.header)} ascending`
  if (sort.direction === 'asc') return `Sort ${String(column.header)} descending`
  return `Clear sorting for ${String(column.header)}`
}

function getAriaSort<T extends object>(
  column: DataTableColumn<T>,
  sort: DataTableSortState | null,
): 'ascending' | 'descending' | 'none' | undefined {
  if (!column.sortable) return undefined
  if (sort?.columnId !== column.id) return 'none'
  return sort.direction === 'asc' ? 'ascending' : 'descending'
}

function getSortIndicator<T extends object>(
  column: DataTableColumn<T>,
  sort: DataTableSortState | null,
): string {
  if (sort?.columnId !== column.id) return '↕'
  return sort.direction === 'asc' ? '↑' : '↓'
}

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
  filterLabel = 'Filter table',
  filterPlaceholder = 'Search data…',
  showFilter = true,
  validate = true,
  initialSort,
  className,
  ...divProps
}: DataTableProps<T>): JSX.Element {
  const filterId = useId()
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState<DataTableSortState | null>(initialSort ?? null)
  const issues = useMemo(
    () => (validate ? validateDataTable(columns, data, getRowId) : []),
    [columns, data, getRowId, validate],
  )
  const isBlocked = hasBlockingValidationIssue(issues)
  const hasFilterableColumns = columns.some(
    (column) =>
      column.filterable !== false &&
      (column.filterValue !== undefined || column.accessor !== undefined),
  )
  const visibleRows = useMemo(() => {
    const filteredRows = filterDataTableRows(data, columns, filter)
    return sortDataTableRows(filteredRows, columns, sort)
  }, [columns, data, filter, sort])

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFilter(event.target.value)
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

      {showFilter && hasFilterableColumns ? (
        <div className={styles.toolbar}>
          <label className={styles.filter} htmlFor={filterId}>
            <span className={styles.visuallyHidden}>{filterLabel}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <input
              id={filterId}
              type="search"
              value={filter}
              placeholder={filterPlaceholder}
              onChange={handleFilterChange}
            />
          </label>
          <span className={styles.count} aria-live="polite">
            {visibleRows.length} of {data.length} rows
          </span>
        </div>
      ) : null}

      {!isBlocked ? (
        <div className={styles.scroller}>
          <table className={styles.table}>
            <caption className={styles.visuallyHidden}>{caption}</caption>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    data-align={column.align ?? 'start'}
                    aria-sort={getAriaSort(column, sort)}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className={styles.sortButton}
                        onClick={() => handleSort(column.id)}
                        aria-label={getSortLabel(column, sort)}
                      >
                        <span>{column.header}</span>
                        <span className={styles.sortIcon} aria-hidden="true">
                          {getSortIndicator(column, sort)}
                        </span>
                      </button>
                    ) : column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.length > 0 ? visibleRows.map((row) => (
                <tr key={getRowId(row)}>
                  {columns.map((column) => (
                    <td key={column.id} data-align={column.align ?? 'start'}>
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                  <td className={styles.empty} colSpan={Math.max(columns.length, 1)}>
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
