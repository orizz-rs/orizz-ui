import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { FormField } from '../form-field'
import styles from './Combobox.module.css'

export interface ComboboxOption {
  readonly value: string
  readonly label: string
  readonly description?: ReactNode
  readonly disabled?: boolean
}

export interface ComboboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  readonly label: string
  readonly options: readonly ComboboxOption[]
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  readonly placeholder?: string
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly loading?: boolean
  readonly emptyMessage?: ReactNode
  readonly fullWidth?: boolean
}

function findOption(
  options: readonly ComboboxOption[],
  value: string,
): ComboboxOption | undefined {
  return options.find((option) => option.value === value)
}

export function Combobox({
  label,
  options,
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Search or select…',
  hint,
  error,
  loading = false,
  emptyMessage = 'No options found.',
  fullWidth = false,
  id,
  className,
  ...divProps
}: ComboboxProps): JSX.Element {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const listboxId = `${inputId}-listbox`
  const messageId = `${inputId}-message`
  const containerRef = useRef<HTMLDivElement>(null)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [query, setQuery] = useState(() =>
    findOption(options, value ?? defaultValue)?.label ?? '',
  )
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const selectedValue = value ?? internalValue
  const selectedOption = findOption(options, selectedValue)
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return options
    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [options, query])
  const enabledOptions = filteredOptions.filter((option) => !option.disabled)
  const activeOption = activeIndex >= 0 ? enabledOptions[activeIndex] : undefined
  const descriptionIds = [hint || error ? messageId : undefined]
    .filter(Boolean)
    .join(' ')
  const classes = [styles.root, fullWidth ? styles.fullWidth : undefined, className]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target
      if (target instanceof Node && !containerRef.current?.contains(target)) {
        setOpen(false)
        setQuery(selectedOption?.label ?? '')
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, selectedOption?.label])

  const selectOption = (option: ComboboxOption): void => {
    if (option.disabled) return
    if (value === undefined) setInternalValue(option.value)
    setQuery(option.label)
    setOpen(false)
    setActiveIndex(-1)
    onValueChange?.(option.value)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value)
    setOpen(true)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) =>
        enabledOptions.length === 0 ? -1 : (current + 1) % enabledOptions.length,
      )
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) =>
        enabledOptions.length === 0
          ? -1
          : current <= 0
            ? enabledOptions.length - 1
            : current - 1,
      )
    } else if (event.key === 'Enter' && open && activeOption) {
      event.preventDefault()
      selectOption(activeOption)
    } else if (event.key === 'Escape') {
      setOpen(false)
      setQuery(selectedOption?.label ?? '')
    }
  }

  return (
    <div {...divProps} className={classes} ref={containerRef}>
      <FormField
        error={error}
        hint={hint}
        htmlFor={inputId}
        label={label}
        messageId={messageId}
      >
        <div className={styles.control}>
          <input
            id={inputId}
            className={[styles.input, error ? styles.invalid : undefined]
              .filter(Boolean)
              .join(' ')}
            value={query}
            placeholder={placeholder}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open ? listboxId : undefined}
            aria-activedescendant={activeOption ? `${listboxId}-${activeOption.value}` : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={descriptionIds || undefined}
            onFocus={() => setOpen(true)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          {open ? (
            <div id={listboxId} className={styles.listbox} role="listbox">
              {loading ? (
                <div className={styles.message} role="status">Loading…</div>
              ) : enabledOptions.length > 0 ? (
                enabledOptions.map((option, index) => (
                  <button
                    key={option.value}
                    id={`${listboxId}-${option.value}`}
                    type="button"
                    className={[
                      styles.option,
                      index === activeIndex ? styles.active : undefined,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    role="option"
                    aria-selected={option.value === selectedValue}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                  >
                    <span>{option.label}</span>
                    {option.description ? (
                      <small>{option.description}</small>
                    ) : null}
                  </button>
                ))
              ) : (
                <div className={styles.message}>{emptyMessage}</div>
              )}
            </div>
          ) : null}
        </div>
      </FormField>
    </div>
  )
}
