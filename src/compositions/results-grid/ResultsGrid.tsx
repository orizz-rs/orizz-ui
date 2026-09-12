import {
  useMemo,
  useState,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import { Download } from 'lucide-react'
import { Button } from '../../components/button'
import { Popover } from '../../components/popover'
import { DataTable, type DataTableColumn } from '../data-table'
import type { ResultColumn, ResultGridExportFormat } from './ResultsGrid.types'
import {
  compareGridValues,
  findNonNullSample,
  formatCellValue,
  isNumericColumn,
  type ResultRow,
} from './ResultsGrid.utils'
import styles from './ResultsGrid.module.css'

export interface ResultsGridProps extends HTMLAttributes<HTMLDivElement> {
  readonly columns: readonly ResultColumn[]
  readonly rows: readonly ResultRow[]
  readonly title?: string
  readonly loading?: boolean
  readonly error?: ReactNode
  readonly onRetry?: () => void
  /** Reports the requested export format; the caller owns the encoding. */
  readonly onExport?: (format: ResultGridExportFormat) => void
  readonly density?: 'compact' | 'regular' | 'comfortable'
  readonly stickyHeader?: boolean
  readonly maxHeight?: number | string
  readonly showRowNumbers?: boolean
  readonly pageSize?: number
}

/**
 * Read-only grid for query results. Builds DataTable column configs from
 * `ResultColumn` metadata: numeric columns are right-aligned monospace,
 * NULL cells are dimmed, and dates render as ISO strings. Row numbers,
 * compact density and a sticky header are enabled by default.
 */
export function ResultsGrid({
  columns,
  rows,
  title = 'Results',
  loading = false,
  error,
  onRetry,
  onExport,
  density = 'compact',
  stickyHeader = true,
  maxHeight = '24rem',
  showRowNumbers = true,
  pageSize = 25,
  className,
  ...divProps
}: ResultsGridProps): JSX.Element {
  const [exportOpen, setExportOpen] = useState(false)

  const gridColumns = useMemo<readonly DataTableColumn<ResultRow>[]>(
    () =>
      columns.map((column) => {
        const numeric = isNumericColumn(column, findNonNullSample(rows, column.id))
        return {
          id: column.id,
          header: column.name,
          align: numeric ? 'end' : 'start',
          numeric,
          sortable: true,
          compare: compareGridValues,
          cell: (row) => {
            const formatted = formatCellValue(row[column.id])
            return formatted.isNull ? (
              <span className={styles.nullCell}>{formatted.text}</span>
            ) : (
              formatted.text
            )
          },
        }
      }),
    [columns, rows],
  )

  return (
    <div
      {...divProps}
      className={[styles.results, className].filter(Boolean).join(' ')}
    >
      <div className={styles.toolbar}>
        <span className={styles.title}>
          {title}
          <span className={styles.count}>
            {rows.length} {rows.length === 1 ? 'row' : 'rows'}
          </span>
        </span>
        {onExport !== undefined ? (
          <Popover
            open={exportOpen}
            onOpenChange={setExportOpen}
            trigger={
              <Button type="button" size="sm" variant="secondary">
                <Download size={14} aria-hidden="true" />
                Export
              </Button>
            }
            title="Export results"
            align="end"
          >
            <div className={styles.exportMenu} role="menu">
              <button
                type="button"
                role="menuitem"
                className={styles.exportItem}
                onClick={() => {
                  onExport('csv')
                  setExportOpen(false)
                }}
              >
                CSV
              </button>
              <button
                type="button"
                role="menuitem"
                className={styles.exportItem}
                onClick={() => {
                  onExport('xlsx')
                  setExportOpen(false)
                }}
              >
                XLSX
              </button>
            </div>
          </Popover>
        ) : null}
      </div>

      <DataTable<ResultRow>
        columns={gridColumns}
        data={rows}
        caption={title}
        density={density}
        stickyHeader={stickyHeader}
        maxHeight={maxHeight}
        showRowNumbers={showRowNumbers}
        pageSize={pageSize}
        pageSizeOptions={[25, 50, 100]}
        loading={loading}
        error={error}
        onRetry={onRetry}
        showFilters={false}
        emptyMessage="The query returned no rows."
      />
    </div>
  )
}