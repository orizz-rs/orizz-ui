import type { JSX, ReactNode } from 'react'
import styles from './DataTable.module.css'

interface DataTableToolbarProps {
  readonly visibleRows: number
  readonly totalRows: number
  readonly selectable: boolean
  readonly selectedRows: number
  readonly selectionActions?: ReactNode
  readonly error?: ReactNode
  readonly onRetry?: () => void
}

export function DataTableToolbar({
  visibleRows,
  totalRows,
  selectable,
  selectedRows,
  selectionActions,
  error,
  onRetry,
}: DataTableToolbarProps): JSX.Element {
  return (
    <>
      <div className={styles.toolbar}>
        <span className={styles.count} aria-live="polite">
          {visibleRows} of {totalRows} rows
        </span>
        {selectable && selectedRows > 0 ? (
          <div className={styles.selectionSummary}>
            <span aria-live="polite">{selectedRows} selected</span>
            {selectionActions}
          </div>
        ) : null}
      </div>
      {error ? (
        <div className={styles.error} role="alert">
          <span>{error}</span>
          {onRetry ? (
            <button type="button" className={styles.retryButton} onClick={onRetry}>
              Retry
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
