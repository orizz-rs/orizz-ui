import type { HTMLAttributes, JSX } from 'react'
import styles from './Skeleton.module.css'

export type SkeletonVariant = 'text' | 'rect' | 'circle'
export type SkeletonSize = 'sm' | 'md' | 'lg'

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  readonly variant?: SkeletonVariant
  readonly size?: SkeletonSize
  readonly label?: string
}

export function Skeleton({
  variant = 'text',
  size = 'md',
  label = 'Loading content',
  className,
  ...spanProps
}: SkeletonProps): JSX.Element {
  const classes = [styles.skeleton, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  return <span {...spanProps} className={classes} role="status" aria-label={label} />
}
