import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './PageHeader.module.css'

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  readonly eyebrow?: ReactNode
  readonly title: ReactNode
  readonly description?: ReactNode
  readonly breadcrumbs?: ReactNode
  readonly actions?: ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  className,
  ...headerProps
}: PageHeaderProps): JSX.Element {
  return (
    <header {...headerProps} className={[styles.header, className].filter(Boolean).join(' ')}>
      {breadcrumbs ? <div className={styles.breadcrumbs}>{breadcrumbs}</div> : null}
      <div className={styles.row}>
        <div className={styles.copy}>
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <h1 className={styles.title}>{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </header>
  )
}
