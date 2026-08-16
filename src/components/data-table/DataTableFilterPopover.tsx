import { X } from 'lucide-react'
import type { CSSProperties, JSX, RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { DataTableColumn } from './DataTable.types'
import { ColumnFilter } from './DataTableFilterControls'
import styles from './DataTable.module.css'

interface DataTableFilterPopoverProps<T extends object> {
  readonly column: DataTableColumn<T>
  readonly id: string
  readonly label: string
  readonly portalRoot: HTMLElement | null
  readonly popoverRef: RefObject<HTMLDivElement | null>
  readonly positionStyle: CSSProperties | undefined
  readonly value: string
  readonly onChange: (columnId: string, value: string) => void
  readonly onDismiss: () => void
}

export function DataTableFilterPopover<T extends object>({
  column,
  id,
  label,
  portalRoot,
  popoverRef,
  positionStyle,
  value,
  onChange,
  onDismiss,
}: DataTableFilterPopoverProps<T>): JSX.Element | null {
  if (!portalRoot) return null
  return createPortal(
    <div
      ref={popoverRef}
      id={id}
      className={styles.filterPopover}
      data-ready={positionStyle ? true : undefined}
      role="group"
      aria-label={`Filter ${label}`}
      style={positionStyle}
    >
      <div className={styles.filterPopoverHeader}>
        <strong>Filter {label}</strong>
        <button
          type="button"
          aria-label={`Dismiss filter popup for ${label}`}
          onClick={onDismiss}
        >
          <X aria-hidden="true" />
        </button>
      </div>
      <ColumnFilter
        column={column}
        id={`${id}-control`}
        label={label}
        value={value}
        onChange={onChange}
      />
    </div>,
    portalRoot,
  )
}
