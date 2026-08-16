import { ChevronDown } from 'lucide-react'
import {
  useId,
  type JSX,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import styles from './Select.module.css'

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly label: string
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly placeholder?: string
  readonly fullWidth?: boolean
  readonly children: ReactNode
}

export function Select({
  label,
  hint,
  error,
  placeholder,
  fullWidth = false,
  id,
  className,
  children,
  'aria-describedby': describedBy,
  ...selectProps
}: SelectProps): JSX.Element {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const messageId = `${selectId}-message`
  const hasMessage = Boolean(error ?? hint)
  const descriptionIds = [describedBy, hasMessage ? messageId : undefined]
    .filter(Boolean)
    .join(' ')
  const fieldClasses = [styles.field, fullWidth ? styles.fullWidth : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={fieldClasses}>
      <label className={styles.label} htmlFor={selectId}>
        {label}
      </label>
      <div className={styles.control}>
        <select
          {...selectProps}
          id={selectId}
          className={[
            styles.select,
            error ? styles.invalid : undefined,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptionIds || undefined}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
        <ChevronDown className={styles.icon} aria-hidden="true" />
      </div>
      {hasMessage ? (
        <span id={messageId} className={error ? styles.error : styles.hint}>
          {error ?? hint}
        </span>
      ) : null}
    </div>
  )
}
