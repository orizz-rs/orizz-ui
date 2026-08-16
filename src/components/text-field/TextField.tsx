import {
  useId,
  type InputHTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import styles from './TextField.module.css'

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  readonly label: string
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly fullWidth?: boolean
}

export function TextField({
  label,
  hint,
  error,
  fullWidth = false,
  id,
  className,
  'aria-describedby': describedBy,
  ...inputProps
}: TextFieldProps): JSX.Element {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const descriptionIds = [describedBy, hint || error ? messageId : undefined]
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
      <input
        {...inputProps}
        id={inputId}
        className={[styles.input, error ? styles.invalid : undefined, className]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={descriptionIds || undefined}
      />
      {error || hint ? (
        <span
          id={messageId}
          className={error ? styles.error : styles.hint}
        >
          {error ?? hint}
        </span>
      ) : null}
    </div>
  )
}
