import type { JSX, ReactNode } from 'react'
import styles from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  readonly id: string
  readonly label: ReactNode
  readonly href?: string
  readonly current?: boolean
}

export interface BreadcrumbProps {
  readonly items: readonly BreadcrumbItem[]
  readonly ariaLabel?: string
  readonly separator?: ReactNode
}

export function Breadcrumb({
  items,
  ariaLabel = 'Breadcrumb',
  separator = '/',
}: BreadcrumbProps): JSX.Element {
  return (
    <nav aria-label={ariaLabel} className={styles.breadcrumb}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = item.current ?? index === items.length - 1

          return (
            <li key={item.id} className={styles.item}>
              {isCurrent || !item.href ? (
                <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
              {index < items.length - 1 ? (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
