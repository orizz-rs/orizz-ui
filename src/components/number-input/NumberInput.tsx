import {
  forwardRef,
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import { FormField } from '../form-field'
import styles from './NumberInput.module.css'

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size' | 'type'> {
  readonly label: string
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly fullWidth?: boolean
  readonly prefix?: ReactNode
  readonly suffix?: ReactNode
  readonly onValueChange?: (
    value: number | null,
    event: ChangeEvent<HTMLInputElement>,
  ) => void
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      label,
      hint,
      error,
      fullWidth = false,
      prefix,
      suffix,
      disabled,
      id,
      className,
      'aria-describedby': describedBy,
      onChange,
      onValueChange,
      required,
      inputMode = 'decimal',
      ...inputProps
    },
    ref,
  ): JSX.Element {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const messageId = `${inputId}-message`
    const descriptionIds = [describedBy, hint || error ? messageId : undefined]
      .filter(Boolean)
      .join(' ')
    const inputClasses = [
      styles.input,
      error ? styles.invalid : undefined,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      onChange?.(event)
      if (onValueChange) {
        const value = event.target.value.trim()
        onValueChange(value === '' ? null : Number(value), event)
      }
    }

    return (
      <FormField
        className={fullWidth ? styles.fullWidth : undefined}
        error={error}
        hint={hint}
        htmlFor={inputId}
        label={label}
        messageId={messageId}
        required={required}
      >
        <div
          className={[
            styles.inputShell,
            error ? styles.invalidShell : undefined,
            disabled ? styles.disabledShell : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {prefix ? <span className={styles.adornment}>{prefix}</span> : null}
          <input
            {...inputProps}
            ref={ref}
            id={inputId}
            type="number"
            inputMode={inputMode}
            required={required}
            disabled={disabled}
            className={inputClasses}
            aria-invalid={error ? true : undefined}
            aria-describedby={descriptionIds || undefined}
            onChange={handleChange}
          />
          {suffix ? <span className={styles.adornment}>{suffix}</span> : null}
        </div>
      </FormField>
    )
  },
)

NumberInput.displayName = 'NumberInput'
