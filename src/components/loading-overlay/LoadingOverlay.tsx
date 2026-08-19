import type { HTMLAttributes, JSX, ReactNode } from 'react'
import { Spinner } from '../spinner'
import styles from './LoadingOverlay.module.css'

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> { readonly open?: boolean; readonly label?: ReactNode; readonly children: ReactNode }

export function LoadingOverlay({ open = true, label = 'Loading', children, className, ...divProps }: LoadingOverlayProps): JSX.Element {
  return <div {...divProps} className={[styles.container, className].filter(Boolean).join(' ')} aria-busy={open}><div className={styles.content}>{children}</div>{open ? <div className={styles.overlay} role="status" aria-label={typeof label === 'string' ? label : undefined}><Spinner size="md" /><span>{label}</span></div> : null}</div>
}
