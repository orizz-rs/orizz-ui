import type { ChangeEvent, JSX, RefObject } from 'react'
import type { DataTableColumn } from './DataTable.types'
import styles from './DataTable.module.css'

interface ColumnFilterProps<T extends object> {
  readonly column: DataTableColumn<T>
  readonly id: string
  readonly label: string
  readonly value: string
  readonly onChange: (columnId: string, value: string) => void
}

export function ColumnFilter<T extends object>({
  column,
  id,
  label,
  value,
  onChange,
}: ColumnFilterProps<T>): JSX.Element | null {
  if (!column.filter) return null
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => onChange(column.id, event.target.value)

  return (
    <label className={styles.columnFilter} htmlFor={id}>
      <span className={styles.visuallyHidden}>Filter {label}</span>
      {column.filter.type === 'select' ? (
        <select id={id} value={value} onChange={handleChange} autoFocus>
          <option value="">{column.filter.placeholder ?? `All ${label}`}</option>
          {column.filter.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type="search"
          autoFocus
          value={value}
          placeholder={column.filter.placeholder ?? `Search ${label}…`}
          onChange={handleChange}
        />
      )}
    </label>
  )
}

interface FilterActionsProps {
  readonly buttonRef: RefObject<HTMLButtonElement | null>
  readonly controlId: string
  readonly isActive: boolean
  readonly isOpen: boolean
  readonly label: string
  readonly onClear: () => void
  readonly onToggle: () => void
}

export function FilterActions({
  buttonRef,
  controlId,
  isActive,
  isOpen,
  label,
  onClear,
  onToggle,
}: FilterActionsProps): JSX.Element {
  const toggleLabel = `${isOpen ? 'Close' : 'Open'} filter for ${label}`
  return (
    <span className={styles.filterActions}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.filterToggle}
        data-active={isActive || undefined}
        aria-controls={controlId}
        aria-expanded={isOpen}
        aria-label={toggleLabel}
        title={toggleLabel}
        onClick={onToggle}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 4h14l-5.5 6.2v4.3l-3 1.5v-5.8L3 4Z" />
        </svg>
      </button>
      {isActive ? (
        <button
          type="button"
          className={styles.filterClear}
          aria-label={`Clear filter for ${label}`}
          title={`Clear filter for ${label}`}
          onClick={onClear}
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </span>
  )
}
