import type { JSX } from 'react'
import type {
  DataTableColumn,
  DataTableSortState,
} from './DataTable.types'
import { DataTableColumnHeader } from './DataTableColumnHeader'

interface DataTableHeaderProps<T extends object> {
  readonly columns: readonly DataTableColumn<T>[]
  readonly filterIdPrefix: string
  readonly filters: Readonly<Record<string, string>>
  readonly showFilters: boolean
  readonly sort: DataTableSortState | null
  readonly onFilterChange: (columnId: string, value: string) => void
  readonly onSort: (columnId: string) => void
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
