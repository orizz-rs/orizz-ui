import type {
  FormHTMLAttributes,
  JSX,
  ReactNode,
} from 'react'
import styles from './Form.module.css'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  readonly error?: ReactNode
  readonly isSubmitting?: boolean
  readonly children: ReactNode
}

export interface FormActionsProps {
  readonly children: ReactNode
  readonly align?: 'start' | 'end' | 'between'
}

export function Form({
  error,
  isSubmitting = false,
  className,
  children,
  ...formProps
}: FormProps): JSX.Element {
  const classes = [styles.form, className].filter(Boolean).join(' ')

  return (
    <form {...formProps} className={classes} aria-busy={isSubmitting || undefined}>
      {error ? <div className={styles.error} role="alert">{error}</div> : null}
      {children}
    </form>
  )
}

export function FormActions({
  children,
  align = 'end',
}: FormActionsProps): JSX.Element {
  return <div className={[styles.actions, styles[align]].join(' ')}>{children}</div>
}
