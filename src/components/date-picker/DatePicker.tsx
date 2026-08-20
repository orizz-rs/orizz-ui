import { CalendarDays } from 'lucide-react'
import {
  useId,
  type InputHTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import styles from './DatePicker.module.css'

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  readonly label: string
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly fullWidth?: boolean
}

export function DatePicker({
  label,
  hint,
  error,
  fullWidth = false,
  id,
  className,
  'aria-describedby': describedBy,
  ...inputProps
}: DatePickerProps): JSX.Element {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const hasMessage = Boolean(error ?? hint)
  const descriptionIds = [describedBy, hasMessage ? messageId : undefined]
    .filter(Boolean)
    .join(' ')
  const fieldClasses = [styles.field, fullWidth ? styles.fullWidth : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={fieldClasses}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.control}>
        <input
          {...inputProps}
          id={inputId}
          type="date"
          className={[styles.input, error ? styles.invalid : undefined, className]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptionIds || undefined}
        />
        <CalendarDays className={styles.icon} aria-hidden="true" />
      </div>
      {hasMessage ? (
        <span id={messageId} className={error ? styles.error : styles.hint}>
          {error ?? hint}
        </span>
      ) : null}
    </div>
  )
}
