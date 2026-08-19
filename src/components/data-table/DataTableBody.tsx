import type { JSX, ReactNode } from 'react'
import type { DataTableColumn } from './DataTable.types'
import { formatDataTableValue, getDataTableValue } from './DataTable.utils'
import styles from './DataTable.module.css'

interface DataTableBodyProps<T extends object> {
  readonly columns: readonly DataTableColumn<T>[]
  readonly rows: readonly T[]
  readonly resolveRowId: (row: T) => string
  readonly selectable: boolean
  readonly selectedRowIds: readonly string[]
  readonly loading: boolean
  readonly emptyMessage: string
  readonly onSelectRow: (rowId: string, selected: boolean) => void
}

function renderCell<T extends object>(
  row: T,
  column: DataTableColumn<T>,
): ReactNode {
  return column.cell?.(row) ?? formatDataTableValue(getDataTableValue(row, column))
}

export function DataTableBody<T extends object>({
  columns,
  rows,
  resolveRowId,
  selectable,
  selectedRowIds,
  loading,
  emptyMessage,
  onSelectRow,
}: DataTableBodyProps<T>): JSX.Element {
  const columnCount = columns.length + (selectable ? 1 : 0)

  if (loading) {
    return (
      <tbody>
        <tr>
          <td className={styles.empty} colSpan={columnCount}>
            <span role="status">Loading data…</span>
          </td>
        </tr>
      </tbody>
    )
  }

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td className={styles.empty} colSpan={Math.max(columnCount, 1)}>
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody>
      {rows.map((row) => {
        const rowId = resolveRowId(row)

        return (
          <tr key={rowId}>
            {selectable ? (
              <td className={styles.selectionCell}>
                <input
                  type="checkbox"
                  aria-label={`Select row ${rowId}`}
                  checked={selectedRowIds.includes(rowId)}
                  onChange={(event) => onSelectRow(rowId, event.target.checked)}
                />
              </td>
            ) : null}
            {columns.map((column) => (
              <td key={column.id} data-align={column.align ?? 'start'}>
                {renderCell(row, column)}
              </td>
            ))}
          </tr>
        )
      })}
    </tbody>
  )
}
