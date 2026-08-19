import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './ResultState.module.css'

export type ResultStateTone = 'neutral' | 'success' | 'warning' | 'danger'
export interface ResultStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> { readonly tone?: ResultStateTone; readonly icon?: ReactNode; readonly title: ReactNode; readonly description?: ReactNode; readonly action?: ReactNode }

export function ResultState({ tone = 'neutral', icon, title, description, action, className, ...divProps }: ResultStateProps): JSX.Element {
  return <div {...divProps} className={[styles.state, styles[tone], className].filter(Boolean).join(' ')} data-tone={tone} role="status"><div className={styles.icon} aria-hidden="true">{icon ?? '!'}</div><h3 className={styles.title}>{title}</h3>{description ? <p className={styles.description}>{description}</p> : null}{action ? <div className={styles.action}>{action}</div> : null}</div>
}
