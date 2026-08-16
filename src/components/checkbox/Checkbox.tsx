import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import styles from './Checkbox.module.css'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly label: ReactNode
  readonly description?: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, description, id, className, disabled, ...inputProps },
    ref,
  ): JSX.Element {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const labelId = `${inputId}-label`
    const descriptionId = `${inputId}-description`
    const classes = [
      styles.group,
      disabled ? styles.disabled : undefined,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <label className={classes} htmlFor={inputId}>
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          type="checkbox"
          className={styles.input}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={description ? descriptionId : undefined}
        />
        <span className={styles.control} aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="m3.5 8 3 3 6-6" />
          </svg>
        </span>
        <span className={styles.content}>
          <span id={labelId} className={styles.label}>
            {label}
          </span>
          {description ? (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
