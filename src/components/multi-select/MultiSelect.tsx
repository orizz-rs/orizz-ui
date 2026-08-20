import { Check, ChevronDown } from 'lucide-react'
import {
  useId,
  useState,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import { FormField } from '../form-field'
import styles from './MultiSelect.module.css'

export interface MultiSelectOption {
  readonly value: string
  readonly label: string
  readonly description?: ReactNode
  readonly disabled?: boolean
}

export interface MultiSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  readonly label: string
  readonly options: readonly MultiSelectOption[]
  readonly value?: readonly string[]
  readonly defaultValue?: readonly string[]
  readonly onValueChange?: (values: readonly string[]) => void
  readonly placeholder?: string
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly fullWidth?: boolean
}

function getSummary(options: readonly MultiSelectOption[], values: readonly string[], placeholder: string): string {
  if (values.length === 0) return placeholder
  if (values.length === 1) return options.find((option) => option.value === values[0])?.label ?? placeholder
  return `${values.length} selected`
}

export function MultiSelect({
  label,
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = 'Select options',
  hint,
  error,
  fullWidth = false,
  id,
  className,
  ...divProps
}: MultiSelectProps): JSX.Element {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const listboxId = `${triggerId}-listbox`
  const messageId = `${triggerId}-message`
  const [internalValues, setInternalValues] = useState<readonly string[]>(defaultValue)
  const [open, setOpen] = useState(false)
  const selectedValues = value ?? internalValues
  const classes = [styles.root, fullWidth ? styles.fullWidth : undefined, className]
    .filter(Boolean)
    .join(' ')

  const updateValues = (nextValues: readonly string[]): void => {
    if (value === undefined) setInternalValues(nextValues)
    onValueChange?.(nextValues)
  }

  const toggleOption = (option: MultiSelectOption): void => {
    if (option.disabled) return
    const isSelected = selectedValues.includes(option.value)
    updateValues(
      isSelected
        ? selectedValues.filter((selectedValue) => selectedValue !== option.value)
        : [...selectedValues, option.value],
    )
  }

  return (
    <div {...divProps} className={classes}>
      <FormField error={error} hint={hint} htmlFor={triggerId} label={label} messageId={messageId}>
        <div className={styles.control}>
          <button
            id={triggerId}
            type="button"
            className={[styles.trigger, error ? styles.invalid : undefined].filter(Boolean).join(' ')}
            aria-label={label}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={open ? listboxId : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={hint || error ? messageId : undefined}
            onClick={() => setOpen((currentOpen) => !currentOpen)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false)
            }}
          >
            <span className={selectedValues.length === 0 ? styles.placeholder : undefined}>
              {getSummary(options, selectedValues, placeholder)}
            </span>
            <ChevronDown className={styles.chevron} aria-hidden="true" />
          </button>
          {open ? (
            <div id={listboxId} className={styles.listbox} role="listbox" aria-multiselectable="true">
              {options.map((option) => {
                const selected = selectedValues.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={[styles.option, selected ? styles.selected : undefined].filter(Boolean).join(' ')}
                    role="option"
                    aria-selected={selected}
                    disabled={option.disabled}
                    onClick={() => toggleOption(option)}
                  >
                    <span className={styles.checkbox} aria-hidden="true">{selected ? <Check /> : null}</span>
                    <span><strong>{option.label}</strong>{option.description ? <small>{option.description}</small> : null}</span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      </FormField>
    </div>
  )
}
