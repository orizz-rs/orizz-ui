import {
  useId,
  useMemo,
  useState,
  type JSX,
} from 'react'
import type { DataTableProps, DataTableSortState } from './DataTable.types'
import {
  filterDataTableRows,
  sortDataTableRows,
} from './DataTable.utils'
import {
  hasBlockingValidationIssue,
  validateDataTable,
} from './DataTable.validation'
import { DataTableHeader } from './DataTableHeader'
import { DataTableBody } from './DataTableBody'
import { DataTablePagination } from './DataTablePagination'
import { DataTableToolbar } from './DataTableToolbar'
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

const defaultPageSizeOptions: readonly number[] = [10, 25, 50]

export function DataTable<T extends object>({
  columns,
  data,
  getRowId,
  caption = 'Data table',
  emptyMessage = 'No matching data found.',
  showFilters = true,
  validate = true,
  initialSort,
  pageSize: requestedPageSize,
  pageSizeOptions = defaultPageSizeOptions,
  initialPage = 0,
  selectable = false,
  selectedRowIds,
  onSelectionChange,
  selectionActions,
  loading = false,
  error,
  onRetry,
  className,
  ...divProps
}: DataTableProps<T>): JSX.Element {
  const filterIdPrefix = useId()
  const [filters, setFilters] = useState<Readonly<Record<string, string>>>({})
  const [sort, setSort] = useState<DataTableSortState | null>(initialSort ?? null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [internalPageSize, setInternalPageSize] = useState(
    requestedPageSize ?? pageSizeOptions[0] ?? 10,
  )
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState<
    readonly string[]
  >(selectedRowIds ?? [])
  const activePageSize = Math.max(1, requestedPageSize ?? internalPageSize)
  const activeSelectedRowIds = selectedRowIds ?? internalSelectedRowIds
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
  const pageCount = Math.max(1, Math.ceil(visibleRows.length / activePageSize))
  const pageIndex = Math.min(Math.max(currentPage, 0), pageCount - 1)
  const pageRows = useMemo(
    () =>
      visibleRows.slice(
        pageIndex * activePageSize,
        (pageIndex + 1) * activePageSize,
      ),
    [activePageSize, pageIndex, visibleRows],
  )
  const visibleRowIds = pageRows.map((row) => resolveRowId(row))
  const allVisibleRowsSelected =
    selectable &&
    visibleRowIds.length > 0 &&
    visibleRowIds.every((rowId) => activeSelectedRowIds.includes(rowId))
  const handleFilterChange = (columnId: string, value: string): void => {
    setFilters((current) => ({ ...current, [columnId]: value }))
    setCurrentPage(0)
  }

  const handleSort = (columnId: string): void => {
    setSort((current) => getNextSort(columnId, current))
    setCurrentPage(0)
  }

  const updateSelection = (nextSelection: readonly string[]): void => {
    if (selectedRowIds === undefined) setInternalSelectedRowIds(nextSelection)
    onSelectionChange?.(nextSelection)
  }

  const handleSelectRow = (rowId: string, selected: boolean): void => {
    const nextSelection = selected
      ? Array.from(new Set([...activeSelectedRowIds, rowId]))
      : activeSelectedRowIds.filter((selectedId) => selectedId !== rowId)
    updateSelection(nextSelection)
  }

  const handleSelectAll = (selected: boolean): void => {
    const nextSelection = selected
      ? Array.from(new Set([...activeSelectedRowIds, ...visibleRowIds]))
      : activeSelectedRowIds.filter((rowId) => !visibleRowIds.includes(rowId))
    updateSelection(nextSelection)
  }

  const handlePageSizeChange = (nextPageSize: number): void => {
    if (requestedPageSize === undefined) setInternalPageSize(nextPageSize)
    setCurrentPage(0)
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
        <DataTableToolbar
          visibleRows={visibleRows.length}
          totalRows={data.length}
          selectable={selectable}
          selectedRows={activeSelectedRowIds.length}
          selectionActions={selectionActions}
          error={error}
          onRetry={onRetry}
        />
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
              selectable={selectable}
              allVisibleRowsSelected={allVisibleRowsSelected}
              onSelectAll={handleSelectAll}
            />
            <DataTableBody
              columns={resolvedColumns}
              rows={pageRows}
              resolveRowId={resolveRowId}
              selectable={selectable}
              selectedRowIds={activeSelectedRowIds}
              loading={loading}
              emptyMessage={emptyMessage}
              onSelectRow={handleSelectRow}
            />
          </table>
        </div>
      ) : null}
      {!isBlocked ? (
        <DataTablePagination
          pageIndex={pageIndex}
          pageSize={activePageSize}
          pageCount={pageCount}
          totalRows={visibleRows.length}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : null}
    </div>
  )
}
