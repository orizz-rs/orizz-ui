import { useEffect, useRef, useState, type JSX } from 'react'
import { X } from 'lucide-react'
import type { DataTableColumn } from './DataTable.types'
import { extractDataTableText } from './DataTable.utils'
import { useDataTablePopoverPosition } from './useDataTablePopoverPosition'
import styles from './DataTable.module.css'

interface DataTableColumnSettingsProps<T extends object> {
  readonly columns: readonly DataTableColumn<T>[]
  readonly visibleColumnIds: readonly string[]
  readonly onChange: (columnIds: readonly string[]) => void
}

function getColumnLabel<T extends object>(column: DataTableColumn<T>): string {
  const text = extractDataTableText(column.header).trim()
  return text !== '' ? text : column.id
}

export function DataTableColumnSettings<T extends object>({
  columns,
  visibleColumnIds,
  onChange,
}: DataTableColumnSettingsProps<T>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const { positionStyle } = useDataTablePopoverPosition(
    isOpen,
    'end',
    buttonRef,
    popoverRef,
  )

  useEffect(() => {
    if (!isOpen) return undefined
    const handlePointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        !buttonRef.current?.contains(event.target) &&
        !popoverRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleToggle = (): void => {
    setIsOpen((current) => !current)
  }

  const handleVisibilityChange = (columnId: string, visible: boolean): void => {
    const nextVisibleIds = visible
      ? [...visibleColumnIds, columnId]
      : visibleColumnIds.filter((id) => id !== columnId)
    // Preserve the declared column order so cells never jump across columns.
    const orderedIds = columns
      .map((column) => column.id)
      .filter((id) => nextVisibleIds.includes(id))
    if (orderedIds.length > 0) {
      onChange(orderedIds)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.settingsToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        Columns
      </button>
      {isOpen ? (
        <div
          ref={popoverRef}
          role="group"
          aria-label="Column visibility"
          className={`${styles.filterPopover} ${styles.settingsPopover}`}
          style={positionStyle}
          data-ready={positionStyle !== undefined || undefined}
        >
          <div className={styles.filterPopoverHeader}>
            <strong>Columns</strong>
            <button
              type="button"
              aria-label="Close column settings"
              onClick={() => {
                setIsOpen(false)
                buttonRef.current?.focus()
              }}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          {columns.map((column) => {
            const visible = visibleColumnIds.includes(column.id)
            return (
              <label key={column.id} className={styles.settingsOption}>
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(event) =>
                    handleVisibilityChange(column.id, event.target.checked)
                  }
                />
                {getColumnLabel(column)}
              </label>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
