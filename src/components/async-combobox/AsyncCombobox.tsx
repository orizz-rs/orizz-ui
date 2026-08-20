import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { FormField } from '../form-field'
import type { ComboboxOption } from '../combobox'
import styles from './AsyncCombobox.module.css'

export interface AsyncComboboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  readonly label: string
  readonly loadOptions: (query: string) => Promise<readonly ComboboxOption[]>
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  readonly placeholder?: string
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly emptyMessage?: ReactNode
  readonly fullWidth?: boolean
}

function findOption(options: readonly ComboboxOption[], value: string): ComboboxOption | undefined {
  return options.find((option) => option.value === value)
}

export function AsyncCombobox({
  label,
  loadOptions,
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Search or select…',
  hint,
  error,
  emptyMessage = 'No options found.',
  fullWidth = false,
  id,
  className,
  ...divProps
}: AsyncComboboxProps): JSX.Element {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const listboxId = `${inputId}-listbox`
  const messageId = `${inputId}-message`
  const requestIdRef = useRef(0)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<readonly ComboboxOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<ReactNode>(null)
  const selectedValue = value ?? internalValue
  const selectedOption = findOption(options, selectedValue)
  const classes = [styles.root, fullWidth ? styles.fullWidth : undefined, className]
    .filter(Boolean)
    .join(' ')

  const loadOptionsForQuery = (nextQuery: string): void => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setLoading(true)
    setLoadError(null)

    void loadOptions(nextQuery)
      .then((nextOptions) => {
        if (requestId !== requestIdRef.current) return
        setOptions(nextOptions)
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return
        setOptions([])
        setLoadError('Unable to load options. Try again.')
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false)
      })
  }

  const selectOption = (option: ComboboxOption): void => {
    if (option.disabled) return
    if (value === undefined) setInternalValue(option.value)
    setQuery(option.label)
    setOpen(false)
    onValueChange?.(option.value)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextQuery = event.target.value
    setQuery(nextQuery)
    setOpen(true)
    loadOptionsForQuery(nextQuery)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Escape') {
      setOpen(false)
      setQuery(selectedOption?.label ?? '')
    }
  }

  const message = error ?? loadError ?? hint

  return (
    <div {...divProps} className={classes}>
      <FormField error={error ?? loadError} hint={hint} htmlFor={inputId} label={label} messageId={messageId}>
        <div className={styles.control}>
          <input
            id={inputId}
            className={[styles.input, error || loadError ? styles.invalid : undefined].filter(Boolean).join(' ')}
            value={query}
            placeholder={placeholder}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open ? listboxId : undefined}
            aria-invalid={error || loadError ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            onFocus={() => {
              setOpen(true)
              loadOptionsForQuery(query)
            }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          {open ? (
            <div id={listboxId} className={styles.listbox} role="listbox">
              {loading ? <div className={styles.message} role="status">Loading options…</div> : null}
              {!loading && options.length > 0
                ? options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={styles.option}
                      role="option"
                      aria-selected={option.value === selectedValue}
                      disabled={option.disabled}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectOption(option)}
                    >
                      <span>{option.label}</span>
                      {option.description ? <small>{option.description}</small> : null}
                    </button>
                  ))
                : null}
              {!loading && options.length === 0 && !loadError ? <div className={styles.message}>{emptyMessage}</div> : null}
            </div>
          ) : null}
        </div>
      </FormField>
    </div>
  )
}
