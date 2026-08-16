import type { HTMLAttributes, JSX } from 'react'
import styles from './Spinner.module.css'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  readonly size?: SpinnerSize
  readonly label?: string
}

export function Spinner({
  size = 'md',
  label = 'Loading',
  className,
  ...spanProps
}: SpinnerProps): JSX.Element {
  const classes = [styles.root, styles[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <span {...spanProps} className={classes} role="status">
      <span className={styles.indicator} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </span>
  )
}
