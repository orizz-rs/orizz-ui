import type { HTMLAttributes, ReactNode } from 'react'

export type DataTableAlign = 'start' | 'center' | 'end'
export type DataTableSortDirection = 'asc' | 'desc'
export type DataTableDensity = 'compact' | 'regular' | 'comfortable'

export interface DataTableSortState {
  readonly columnId: string
  readonly direction: DataTableSortDirection
}

export interface DataTablePageState {
  readonly pageIndex: number
  readonly pageSize: number
}

export interface DataTableTextFilter {
  readonly type: 'text'
  readonly label?: string
  readonly placeholder?: string
}

export interface DataTableFilterOption {
  readonly value: string
  readonly label: string
}

export interface DataTableSelectFilter {
  readonly type: 'select'
  readonly label?: string
  readonly placeholder?: string
  readonly options: readonly DataTableFilterOption[]
}

export type DataTableColumnFilter = DataTableTextFilter | DataTableSelectFilter

export interface DataTableColumn<T extends object> {
  readonly id: string
  readonly header: ReactNode
  readonly accessor?: keyof T
  readonly cell?: (row: T) => ReactNode
  readonly align?: DataTableAlign
  /** Right-aligned monospace cell for numeric database values. */
  readonly numeric?: boolean
  /** Fixed column width; numbers are treated as pixels. */
  readonly width?: number | string
  /** Minimum column width, e.g. `'8rem'`. */
  readonly minWidth?: string
  /** Starts hidden; users can re-show it from the column settings. */
  readonly hidden?: boolean
  readonly required?: boolean
  readonly sortable?: boolean
  readonly compare?: (left: T, right: T) => number
  readonly sortValue?: (row: T) => unknown
  readonly filter?: DataTableColumnFilter
  readonly filterValue?: (row: T) => string
}

export type DataTableValidationCode =
  | 'duplicate-column-id'
  | 'missing-column-header'
  | 'missing-column-source'
  | 'duplicate-row-id'
  | 'missing-row-id'
  | 'missing-required-value'
  | 'missing-filter-source'
  | 'invalid-filter-type'
  | 'missing-filter-options'
  | 'duplicate-filter-option-value'
  | 'invalid-filter-option'

export interface DataTableValidationIssue {
  readonly id: string
  readonly code: DataTableValidationCode
  readonly message: string
  readonly columnId?: string
}

export interface DataTableProps<T extends object>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly columns?: readonly DataTableColumn<T>[]
  readonly data: readonly T[]
  readonly getRowId?: (row: T) => string
  readonly caption?: string
  readonly emptyMessage?: string
  readonly showFilters?: boolean
  readonly validate?: boolean
  readonly initialSort?: DataTableSortState
  readonly pageSize?: number
  readonly pageSizeOptions?: readonly number[]
  readonly initialPage?: number
  readonly selectable?: boolean
  readonly selectedRowIds?: readonly string[]
  readonly onSelectionChange?: (rowIds: readonly string[]) => void
  readonly selectionActions?: ReactNode
  readonly loading?: boolean
  readonly error?: ReactNode
  readonly onRetry?: () => void
  /** Row height and cell padding; defaults to `'regular'`. */
  readonly density?: DataTableDensity
  /** Keeps the header row visible while the table body scrolls. */
  readonly stickyHeader?: boolean
  /** Scroll height of the table area; enables vertical scrolling. */
  readonly maxHeight?: number | string
  /** Leading column with the ordinal number of each row. */
  readonly showRowNumbers?: boolean
  /** Keeps the first leading cell visible during horizontal scrolling. */
  readonly stickyFirstColumn?: boolean
  /**
   * Result count reported by the server. When provided, the table renders
   * `data` as the current page and stops filtering, sorting and paginating
   * on its own; wire `onSortChange`, `onPageChange` and `onFiltersChange`
   * to refetch instead.
   */
  readonly totalRows?: number
  readonly sort?: DataTableSortState | null
  readonly onSortChange?: (sort: DataTableSortState | null) => void
  readonly pageIndex?: number
  readonly onPageChange?: (pageIndex: number) => void
  readonly filters?: Readonly<Record<string, string>>
  readonly onFiltersChange?: (filters: Readonly<Record<string, string>>) => void
  readonly visibleColumnIds?: readonly string[]
  readonly onVisibleColumnIdsChange?: (columnIds: readonly string[]) => void
}
