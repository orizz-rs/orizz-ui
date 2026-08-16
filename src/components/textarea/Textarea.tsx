import {
  useId,
  type JSX,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import styles from './Textarea.module.css'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly label: string
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly fullWidth?: boolean
  readonly resize?: 'none' | 'vertical'
}

export function Textarea({
  label,
  hint,
  error,
  fullWidth = false,
  resize = 'vertical',
  id,
  className,
  'aria-describedby': describedBy,
  ...textareaProps
}: TextareaProps): JSX.Element {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const messageId = `${textareaId}-message`
  const hasMessage = Boolean(error ?? hint)
  const descriptionIds = [describedBy, hasMessage ? messageId : undefined]
    .filter(Boolean)
    .join(' ')
  const fieldClasses = [styles.field, fullWidth ? styles.fullWidth : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={fieldClasses}>
      <label className={styles.label} htmlFor={textareaId}>
        {label}
      </label>
      <textarea
        {...textareaProps}
        id={textareaId}
        className={[
          styles.textarea,
          styles[resize],
          error ? styles.invalid : undefined,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={descriptionIds || undefined}
      />
      {hasMessage ? (
        <span id={messageId} className={error ? styles.error : styles.hint}>
          {error ?? hint}
        </span>
      ) : null}
    </div>
  )
}
