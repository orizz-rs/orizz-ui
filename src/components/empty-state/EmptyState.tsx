import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './EmptyState.module.css'

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  readonly title: ReactNode
  readonly description?: ReactNode
  readonly icon?: ReactNode
  readonly action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...divProps
}: EmptyStateProps): JSX.Element {
  const classes = [styles.emptyState, className].filter(Boolean).join(' ')

  return (
    <div {...divProps} className={classes}>
      {icon ? <div className={styles.icon} aria-hidden="true">{icon}</div> : null}
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}
