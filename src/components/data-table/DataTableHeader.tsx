import type { ChangeEvent, JSX, ReactNode } from 'react'
import type {
  DataTableColumn,
  DataTableSortState,
} from './DataTable.types'
import styles from './DataTable.module.css'

interface DataTableHeaderProps<T extends object> {
  readonly columns: readonly DataTableColumn<T>[]
  readonly filterIdPrefix: string
  readonly filters: Readonly<Record<string, string>>
  readonly showFilters: boolean
  readonly sort: DataTableSortState | null
  readonly onFilterChange: (columnId: string, value: string) => void
  readonly onSort: (columnId: string) => void
}

function getHeaderText(header: ReactNode, columnId: string): string {
  if (typeof header === 'string' || typeof header === 'number') return String(header)
  return columnId
}

function getSortLabel<T extends object>(
  column: DataTableColumn<T>,
  sort: DataTableSortState | null,
): string {
  const header = getHeaderText(column.header, column.id)
  if (sort?.columnId !== column.id) return `Sort ${header} ascending`
  if (sort.direction === 'asc') return `Sort ${header} descending`
  return `Clear sorting for ${header}`
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

interface ColumnFilterProps<T extends object> {
  readonly column: DataTableColumn<T>
  readonly id: string
  readonly value: string
  readonly onChange: (columnId: string, value: string) => void
}

function ColumnFilter<T extends object>({
  column,
  id,
  value,
  onChange,
}: ColumnFilterProps<T>): JSX.Element | null {
  if (!column.filter) return null
  const label = column.filter.label ?? getHeaderText(column.header, column.id)
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => onChange(column.id, event.target.value)

  return (
    <label className={styles.columnFilter} htmlFor={id}>
      <span className={styles.visuallyHidden}>Filter {label}</span>
      {column.filter.type === 'select' ? (
        <select id={id} value={value} onChange={handleChange}>
          <option value="">{column.filter.placeholder ?? `All ${label}`}</option>
          {column.filter.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type="search"
          value={value}
          placeholder={column.filter.placeholder ?? `Search ${label}…`}
          onChange={handleChange}
        />
      )}
    </label>
  )
}

export function DataTableHeader<T extends object>({
  columns,
  filterIdPrefix,
  filters,
  showFilters,
  sort,
  onFilterChange,
  onSort,
}: DataTableHeaderProps<T>): JSX.Element {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.id}
            scope="col"
            data-align={column.align ?? 'start'}
            aria-sort={getAriaSort(column, sort)}
          >
            <div className={styles.headerContent}>
              {column.sortable ? (
                <button
                  type="button"
                  className={styles.sortButton}
                  onClick={() => onSort(column.id)}
                  aria-label={getSortLabel(column, sort)}
                >
                  <span>{column.header}</span>
                  <span className={styles.sortIcon} aria-hidden="true">
                    {getSortIndicator(column, sort)}
                  </span>
                </button>
              ) : <span className={styles.headerLabel}>{column.header}</span>}
              {showFilters ? (
                <ColumnFilter
                  column={column}
                  id={`${filterIdPrefix}-${column.id}`}
                  value={filters[column.id] ?? ''}
                  onChange={onFilterChange}
                />
              ) : null}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}
