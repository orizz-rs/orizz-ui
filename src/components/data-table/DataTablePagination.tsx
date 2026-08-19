import type { JSX } from 'react'
import styles from './DataTable.module.css'

interface DataTablePaginationProps {
  readonly pageIndex: number
  readonly pageSize: number
  readonly pageCount: number
  readonly totalRows: number
  readonly pageSizeOptions: readonly number[]
  readonly onPageChange: (pageIndex: number) => void
  readonly onPageSizeChange: (pageSize: number) => void
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps): JSX.Element | null {
  if (totalRows === 0) return null

  const firstRow = pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <nav className={styles.pagination} aria-label="Data table pagination">
      <span className={styles.paginationSummary}>
        Showing {firstRow}–{lastRow} of {totalRows}
      </span>
      <label className={styles.pageSizeLabel}>
        Rows
        <select
          aria-label="Rows per page"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {pageCount > 1 ? (
        <div className={styles.pageButtons}>
          <button
            type="button"
            className={styles.pageButton}
            disabled={pageIndex === 0}
            onClick={() => onPageChange(pageIndex - 1)}
          >
            Previous
          </button>
          <span aria-live="polite" className={styles.pageIndicator}>
            Page {pageIndex + 1} of {pageCount}
          </span>
          <button
            type="button"
            className={styles.pageButton}
            disabled={pageIndex >= pageCount - 1}
            onClick={() => onPageChange(pageIndex + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </nav>
  )
}
