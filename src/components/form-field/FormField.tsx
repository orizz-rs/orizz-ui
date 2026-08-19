import {
  type HTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import styles from './FormField.module.css'

export interface FormFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly label: ReactNode
  readonly htmlFor?: string
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly required?: boolean
  readonly messageId?: string
  readonly children: ReactNode
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  messageId,
  children,
  className,
  ...divProps
}: FormFieldProps): JSX.Element {
  const classes = [styles.field, className].filter(Boolean).join(' ')
  const message = error ?? hint

  return (
    <div
      {...divProps}
      className={classes}
      data-invalid={error ? 'true' : undefined}
    >
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            {' '}*
          </span>
        ) : null}
      </label>
      <div className={styles.control}>{children}</div>
      {message ? (
        <span
          id={messageId}
          className={error ? styles.error : styles.hint}
          role={error ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
