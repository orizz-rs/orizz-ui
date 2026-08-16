import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './Alert.module.css'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  readonly tone?: AlertTone
  readonly title: ReactNode
  readonly children?: ReactNode
  readonly action?: ReactNode
  readonly onDismiss?: () => void
  readonly dismissLabel?: string
}

const icons: Readonly<Record<AlertTone, string>> = {
  info: 'i',
  success: '✓',
  warning: '!',
  danger: '!',
}

export function Alert({
  tone = 'info',
  title,
  children,
  action,
  onDismiss,
  dismissLabel = 'Dismiss notification',
  className,
  ...divProps
}: AlertProps): JSX.Element {
  const classes = [styles.alert, styles[tone], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div {...divProps} className={classes}>
      <span className={styles.icon} aria-hidden="true">
        {icons[tone]}
      </span>
      <div className={styles.content}>
        <strong className={styles.title}>{title}</strong>
        {children ? <div className={styles.description}>{children}</div> : null}
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 4 8 8m0-8-8 8" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
