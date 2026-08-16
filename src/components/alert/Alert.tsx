import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
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

const icons: Readonly<Record<AlertTone, LucideIcon>> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
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
  const ToneIcon = icons[tone]
  const classes = [styles.alert, styles[tone], className]
    .filter(Boolean)
    .join(' ')

  return (
    <div {...divProps} className={classes}>
      <span className={styles.icon} aria-hidden="true">
        <ToneIcon />
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
          <X aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
