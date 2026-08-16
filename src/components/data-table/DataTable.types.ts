import type { HTMLAttributes, ReactNode } from 'react'

export type DataTableAlign = 'start' | 'center' | 'end'
export type DataTableSortDirection = 'asc' | 'desc'

export interface DataTableSortState {
  readonly columnId: string
  readonly direction: DataTableSortDirection
}

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
  readonly filterable?: boolean
  readonly filterValue?: (row: T) => string
}

export type DataTableValidationCode =
  | 'duplicate-column-id'
  | 'missing-column-header'
  | 'missing-column-source'
  | 'duplicate-row-id'
  | 'missing-row-id'
  | 'missing-required-value'

export interface DataTableValidationIssue {
  readonly id: string
  readonly code: DataTableValidationCode
  readonly message: string
  readonly columnId?: string
}

export interface DataTableProps<T extends object>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly columns: readonly DataTableColumn<T>[]
  readonly data: readonly T[]
  readonly getRowId: (row: T) => string
  readonly caption?: string
  readonly emptyMessage?: string
  readonly filterLabel?: string
  readonly filterPlaceholder?: string
  readonly showFilter?: boolean
  readonly validate?: boolean
  readonly initialSort?: DataTableSortState
}
