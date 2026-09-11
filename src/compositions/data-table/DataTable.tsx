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
import { DataTableColumnSettings } from './DataTableColumnSettings'
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
  density = 'regular',
  stickyHeader = false,
  maxHeight,
  showRowNumbers = false,
  stickyFirstColumn = false,
  totalRows,
  sort,
  onSortChange,
  pageIndex,
  onPageChange,
  filters,
  onFiltersChange,
  visibleColumnIds,
  onVisibleColumnIdsChange,
  className,
  ...divProps
}: DataTableProps<T>): JSX.Element {
  const filterIdPrefix = useId()
  const serverMode = totalRows !== undefined
  const [internalFilters, setInternalFilters] = useState<Readonly<Record<string, string>>>({})
  const [internalSort, setInternalSort] = useState<DataTableSortState | null>(initialSort ?? null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [internalPageSize, setInternalPageSize] = useState(
    requestedPageSize ?? pageSizeOptions[0] ?? 10,
  )
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState<
    readonly string[]
  >(selectedRowIds ?? [])
  const [internalVisibleColumnIds, setInternalVisibleColumnIds] = useState<
    readonly string[] | undefined
  >(undefined)
  const activePageSize = Math.max(1, requestedPageSize ?? internalPageSize)
  const activeSelectedRowIds = selectedRowIds ?? internalSelectedRowIds
  const activeFilters = filters ?? internalFilters
  const activeSort = sort !== undefined ? sort : internalSort
  const { resolvedColumns, resolveRowId } = useDataTableSetup(
    columns,
    data,
    getRowId,
  )
  const defaultVisibleColumnIds = useMemo(
    () => resolvedColumns.filter((column) => !column.hidden).map((column) => column.id),
    [resolvedColumns],
  )
  const activeVisibleColumnIds =
    visibleColumnIds ?? internalVisibleColumnIds ?? defaultVisibleColumnIds
  const visibleColumns = useMemo(
    () => resolvedColumns.filter((column) => activeVisibleColumnIds.includes(column.id)),
    [activeVisibleColumnIds, resolvedColumns],
  )
  const issues = useMemo(
    () => (validate ? validateDataTable(resolvedColumns, data, resolveRowId) : []),
    [data, resolveRowId, resolvedColumns, validate],
  )
  const isBlocked = hasBlockingValidationIssue(issues)
  const visibleRows = useMemo(() => {
    if (serverMode) return data
    const filteredRows = filterDataTableRows(data, resolvedColumns, activeFilters)
    return sortDataTableRows(filteredRows, resolvedColumns, activeSort)
  }, [activeFilters, activeSort, data, resolvedColumns, serverMode])
  const pageCount = serverMode
    ? Math.max(1, Math.ceil(totalRows / activePageSize))
    : Math.max(1, Math.ceil(visibleRows.length / activePageSize))
  const requestedPageIndex = pageIndex !== undefined ? pageIndex : currentPage
  const effectivePageIndex = Math.min(Math.max(requestedPageIndex, 0), pageCount - 1)
  const pageRows = serverMode
    ? data
    : visibleRows.slice(
        effectivePageIndex * activePageSize,
        (effectivePageIndex + 1) * activePageSize,
      )
  const rowNumberStart = effectivePageIndex * activePageSize
  const visibleRowIds = pageRows.map((row) => resolveRowId(row))
  const allVisibleRowsSelected =
    selectable &&
    visibleRowIds.length > 0 &&
    visibleRowIds.every((rowId) => activeSelectedRowIds.includes(rowId))
  const gridRowsTotal = serverMode ? totalRows : data.length

  const handleFilterChange = (columnId: string, value: string): void => {
    const nextFilters = { ...activeFilters, [columnId]: value }
    if (filters === undefined) setInternalFilters(nextFilters)
    onFiltersChange?.(nextFilters)
    if (pageIndex === undefined) setCurrentPage(0)
  }

  const handleSort = (columnId: string): void => {
    const nextSort = getNextSort(columnId, activeSort)
    if (sort === undefined) setInternalSort(nextSort)
    onSortChange?.(nextSort)
    if (pageIndex === undefined) setCurrentPage(0)
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
    if (pageIndex === undefined) setCurrentPage(0)
  }

  const updateVisibleColumns = (nextColumnIds: readonly string[]): void => {
    if (visibleColumnIds === undefined) setInternalVisibleColumnIds(nextColumnIds)
    onVisibleColumnIdsChange?.(nextColumnIds)
  }

  const scrollerStyle =
    maxHeight !== undefined ? { maxHeight } : undefined

  return (
    <div
      {...divProps}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-density={density}
    >
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
          visibleRows={serverMode ? pageRows.length : visibleRows.length}
          totalRows={gridRowsTotal}
          serverMode={serverMode}
          selectable={selectable}
          selectedRows={activeSelectedRowIds.length}
          selectionActions={selectionActions}
          columnSettings={
            resolvedColumns.length > 1 ? (
              <DataTableColumnSettings
                columns={resolvedColumns}
                visibleColumnIds={activeVisibleColumnIds}
                onChange={updateVisibleColumns}
              />
            ) : undefined
          }
          error={error}
          onRetry={onRetry}
        />
      ) : null}

      {!isBlocked ? (
        <div
          className={styles.scroller}
          data-sticky-header={stickyHeader || undefined}
          data-scroll-y={stickyHeader || maxHeight !== undefined ? 'true' : undefined}
          style={scrollerStyle}
        >
          <table className={styles.table} data-sticky-first={stickyFirstColumn || undefined}>
            <caption className={styles.visuallyHidden}>{caption}</caption>
            <DataTableHeader
              columns={visibleColumns}
              filterIdPrefix={filterIdPrefix}
              filters={activeFilters}
              showFilters={showFilters}
              showRowNumbers={showRowNumbers}
              sort={activeSort}
              onFilterChange={handleFilterChange}
              onSort={handleSort}
              selectable={selectable}
              allVisibleRowsSelected={allVisibleRowsSelected}
              onSelectAll={handleSelectAll}
            />
            <DataTableBody
              columns={visibleColumns}
              rows={pageRows}
              resolveRowId={resolveRowId}
              selectable={selectable}
              selectedRowIds={activeSelectedRowIds}
              showRowNumbers={showRowNumbers}
              rowNumberStart={rowNumberStart}
              loading={loading}
              emptyMessage={emptyMessage}
              onSelectRow={handleSelectRow}
            />
          </table>
        </div>
      ) : null}
      {!isBlocked ? (
        <DataTablePagination
          pageIndex={effectivePageIndex}
          pageSize={activePageSize}
          pageCount={pageCount}
          totalRows={serverMode ? totalRows : visibleRows.length}
          pageSizeOptions={pageSizeOptions}
          onPageChange={onPageChange ?? setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : null}
    </div>
  )
}
