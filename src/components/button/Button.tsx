import {
  forwardRef,
  type ButtonHTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  readonly variant?: ButtonVariant
  /** Controls the button height and horizontal spacing. */
  readonly size?: ButtonSize
  /** Shows progress and prevents additional clicks. */
  readonly isLoading?: boolean
  /** Makes the button fill the available width. */
  readonly fullWidth?: boolean
  readonly children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      type = 'button',
      ...buttonProps
    },
    ref,
  ): JSX.Element {
    const classes = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : undefined,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        {...buttonProps}
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
      >
        {isLoading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : null}
        <span
          className={[
            styles.content,
            isLoading ? styles.hiddenLabel : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </span>
      </button>
    )
  },
)

Button.displayName = 'Button'
