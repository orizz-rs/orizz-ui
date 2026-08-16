import type { HTMLAttributes, ReactNode } from 'react'

export type DataTableAlign = 'start' | 'center' | 'end'
export type DataTableSortDirection = 'asc' | 'desc'

export interface DataTableSortState {
  readonly columnId: string
  readonly direction: DataTableSortDirection
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
}
