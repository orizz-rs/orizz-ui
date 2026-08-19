import type { JSX, ProgressHTMLAttributes } from 'react'
import styles from './Progress.module.css'

export interface ProgressProps
  extends Omit<ProgressHTMLAttributes<HTMLProgressElement>, 'children'> {
  readonly label?: string
  readonly showValue?: boolean
  readonly indeterminate?: boolean
}

export function Progress({
  value,
  max = 100,
  label = 'Progress',
  showValue = true,
  indeterminate = false,
  className,
  ...progressProps
}: ProgressProps): JSX.Element {
  const classes = [styles.root, className].filter(Boolean).join(' ')
  const progressMax = typeof max === 'number' ? max : Number(max ?? 100)
  const displayValue =
    typeof value === 'number' ? Math.round((value / progressMax) * 100) : null

  return (
    <div className={classes}>
      <div className={styles.header}>
        <span>{label}</span>
        {showValue && displayValue !== null && !indeterminate ? <span>{displayValue}%</span> : null}
      </div>
      <progress
        {...progressProps}
        value={indeterminate ? undefined : value}
        max={progressMax}
        aria-label={label}
      />
    </div>
  )
}
