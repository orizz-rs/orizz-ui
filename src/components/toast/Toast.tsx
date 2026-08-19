import { X } from 'lucide-react'
import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './Toast.module.css'

export type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  readonly open: boolean
  readonly tone?: ToastTone
  readonly title: ReactNode
  readonly children?: ReactNode
  readonly onDismiss?: () => void
  readonly dismissLabel?: string
}

export function Toast({
  open,
  tone = 'info',
  title,
  children,
  onDismiss,
  dismissLabel = 'Dismiss notification',
  className,
  ...divProps
}: ToastProps): JSX.Element | null {
  if (!open) return null
  const classes = [styles.toast, styles[tone], className].filter(Boolean).join(' ')

  return (
    <div
      {...divProps}
      className={classes}
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <div className={styles.content}>
        <strong>{title}</strong>
        {children ? <span>{children}</span> : null}
      </div>
      {onDismiss ? (
        <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label={dismissLabel}>
          <X aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
