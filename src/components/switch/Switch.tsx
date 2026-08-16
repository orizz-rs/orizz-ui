import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import styles from './Switch.module.css'

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> {
  readonly label: ReactNode
  readonly description?: ReactNode
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
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
      <input
        {...inputProps}
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        className={styles.input}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </label>
  )
})

Switch.displayName = 'Switch'
