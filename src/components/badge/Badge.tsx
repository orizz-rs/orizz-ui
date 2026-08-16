import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './Badge.module.css'

export type BadgeTone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly tone?: BadgeTone
  readonly children: ReactNode
}

export function Badge({
  tone = 'neutral',
  className,
  children,
  ...spanProps
}: BadgeProps): JSX.Element {
  const classes = [styles.badge, styles[tone], className]
    .filter(Boolean)
    .join(' ')

  return (
    <span {...spanProps} className={classes}>
      {children}
    </span>
  )
}
