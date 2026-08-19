import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './Toolbar.module.css'

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  readonly start?: ReactNode
  readonly end?: ReactNode
}

export function Toolbar({ start, end, children, className, ...divProps }: ToolbarProps): JSX.Element {
  return <div {...divProps} className={[styles.toolbar, className].filter(Boolean).join(' ')}><div className={styles.start}>{start ?? children}</div>{end ? <div className={styles.end}>{end}</div> : null}</div>
}
