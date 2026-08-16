import {
  useEffect,
  useRef,
  useState,
  type JSX,
  type ReactNode,
} from 'react'
import type {
  DataTableColumn,
  DataTableSortState,
} from './DataTable.types'
import { FilterActions } from './DataTableFilterControls'
import { DataTableFilterPopover } from './DataTableFilterPopover'
import { useDataTablePopoverPosition } from './useDataTablePopoverPosition'
import styles from './DataTable.module.css'

interface DataTableColumnHeaderProps<T extends object> {
  readonly column: DataTableColumn<T>
  readonly filterIdPrefix: string
  readonly filterValue: string
  readonly showFilters: boolean
  readonly sort: DataTableSortState | null
  readonly onFilterChange: (columnId: string, value: string) => void
  readonly onSort: (columnId: string) => void
}

function getHeaderText(header: ReactNode, columnId: string): string {
  if (typeof header === 'string' || typeof header === 'number') return String(header)
  return columnId
}

function getSortLabel<T extends object>(
  column: DataTableColumn<T>,
  sort: DataTableSortState | null,
): string {
  const header = getHeaderText(column.header, column.id)
  if (sort?.columnId !== column.id) return `Sort ${header} ascending`
  if (sort.direction === 'asc') return `Sort ${header} descending`
  return `Clear sorting for ${header}`
}

function getAriaSort<T extends object>(
  column: DataTableColumn<T>,
  sort: DataTableSortState | null,
): 'ascending' | 'descending' | 'none' | undefined {
  if (!column.sortable) return undefined
  if (sort?.columnId !== column.id) return 'none'
  return sort.direction === 'asc' ? 'ascending' : 'descending'
}

function getSortIndicator<T extends object>(
  column: DataTableColumn<T>,
  sort: DataTableSortState | null,
): string {
  if (sort?.columnId !== column.id) return '↕'
  return sort.direction === 'asc' ? '↑' : '↓'
}

function findPortalRoot(element: HTMLElement | null): HTMLElement | null {
  if (typeof document === 'undefined') return null
  let current = element?.parentElement ?? null
  while (current) {
    if (current.dataset.theme) return current
    current = current.parentElement
  }
  return document.body
}

export function DataTableColumnHeader<T extends object>({
  column,
  filterIdPrefix,
  filterValue,
  showFilters,
  sort,
  onFilterChange,
  onSort,
}: DataTableColumnHeaderProps<T>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  const headerRef = useRef<HTMLTableCellElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const label = column.filter?.label ?? getHeaderText(column.header, column.id)
  const popoverId = `${filterIdPrefix}-${column.id}-popover`
  const isActive = filterValue !== ''
  const { positionStyle } = useDataTablePopoverPosition(
    isOpen,
    column.align ?? 'start',
    toggleRef,
    popoverRef,
  )

  useEffect(() => {
    if (!isOpen) return undefined
    const handlePointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target) &&
        !popoverRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
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
    if (!isOpen) setPortalRoot(findPortalRoot(headerRef.current))
    setIsOpen((current) => !current)
  }

  return (
    <th
      ref={headerRef}
      scope="col"
      data-align={column.align ?? 'start'}
      data-filter-open={isOpen || undefined}
      aria-sort={getAriaSort(column, sort)}
    >
      <div className={styles.headerContent}>
        <div className={styles.headerTop}>
          {column.sortable ? (
            <button
              type="button"
              className={styles.sortButton}
              onClick={() => onSort(column.id)}
              aria-label={getSortLabel(column, sort)}
            >
              <span>{column.header}</span>
              <span className={styles.sortIcon} aria-hidden="true">
                {getSortIndicator(column, sort)}
              </span>
            </button>
          ) : <span className={styles.headerLabel}>{column.header}</span>}
          {showFilters && column.filter ? (
            <FilterActions
              buttonRef={toggleRef}
              controlId={popoverId}
              isActive={isActive}
              isOpen={isOpen}
              label={label}
              onClear={() => onFilterChange(column.id, '')}
              onToggle={handleToggle}
            />
          ) : null}
        </div>
        {showFilters && column.filter && isOpen ? (
          <DataTableFilterPopover
            column={column}
            id={popoverId}
            label={label}
            portalRoot={portalRoot}
            popoverRef={popoverRef}
            positionStyle={positionStyle}
            value={filterValue}
            onChange={onFilterChange}
            onDismiss={() => {
              setIsOpen(false)
              toggleRef.current?.focus()
            }}
          />
        ) : null}
      </div>
    </th>
  )
}
