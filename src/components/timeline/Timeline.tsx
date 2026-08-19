import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './Timeline.module.css'

export type TimelineItemTone = 'neutral' | 'success' | 'warning' | 'danger'
export interface TimelineItem { readonly id: string; readonly title: ReactNode; readonly description?: ReactNode; readonly timestamp?: ReactNode; readonly tone?: TimelineItemTone }
export interface TimelineProps extends HTMLAttributes<HTMLOListElement> { readonly items: readonly TimelineItem[]; readonly ariaLabel?: string }

export function Timeline({ items, ariaLabel = 'Activity timeline', className, ...listProps }: TimelineProps): JSX.Element {
  return <ol {...listProps} className={[styles.timeline, className].filter(Boolean).join(' ')} aria-label={ariaLabel}>{items.map((item) => <li className={styles.item} key={item.id}><span className={[styles.marker, styles[item.tone ?? 'neutral']].join(' ')} aria-hidden="true" /><div className={styles.content}><div className={styles.heading}><strong>{item.title}</strong>{item.timestamp ? <time>{item.timestamp}</time> : null}</div>{item.description ? <p>{item.description}</p> : null}</div></li>)}</ol>
}
