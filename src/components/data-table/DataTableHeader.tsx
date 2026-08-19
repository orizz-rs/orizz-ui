import type { JSX } from 'react'
import type {
  DataTableColumn,
  DataTableSortState,
} from './DataTable.types'
import { DataTableColumnHeader } from './DataTableColumnHeader'
import styles from './DataTable.module.css'

interface DataTableHeaderProps<T extends object> {
  readonly columns: readonly DataTableColumn<T>[]
  readonly filterIdPrefix: string
  readonly filters: Readonly<Record<string, string>>
  readonly showFilters: boolean
  readonly sort: DataTableSortState | null
  readonly onFilterChange: (columnId: string, value: string) => void
  readonly onSort: (columnId: string) => void
  readonly selectable: boolean
  readonly allVisibleRowsSelected: boolean
  readonly onSelectAll: (selected: boolean) => void
}

export function DataTableHeader<T extends object>({
  columns,
  filterIdPrefix,
  filters,
  showFilters,
  sort,
  onFilterChange,
  onSort,
  selectable,
  allVisibleRowsSelected,
  onSelectAll,
}: DataTableHeaderProps<T>): JSX.Element {
  return (
    <thead>
      <tr>
        {selectable ? (
          <th className={styles.selectionHeader} scope="col">
            <input
              type="checkbox"
              aria-label="Select all visible rows"
              checked={allVisibleRowsSelected}
              onChange={(event) => onSelectAll(event.target.checked)}
            />
          </th>
        ) : null}
        {columns.map((column) => (
          <DataTableColumnHeader
            key={column.id}
            column={column}
            filterIdPrefix={filterIdPrefix}
            filterValue={filters[column.id] ?? ''}
            showFilters={showFilters}
            sort={sort}
            onFilterChange={onFilterChange}
            onSort={onSort}
          />
        ))}
      </tr>
    </thead>
  )
}
