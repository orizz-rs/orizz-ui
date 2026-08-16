import type { HTMLAttributes, JSX } from 'react'
import styles from './Avatar.module.css'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarStatus = 'online' | 'offline' | 'busy'

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  readonly src?: string
  readonly alt: string
  readonly fallback: string
  readonly size?: AvatarSize
  readonly status?: AvatarStatus
}

const statusLabels: Readonly<Record<AvatarStatus, string>> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
}

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  status,
  className,
  ...spanProps
}: AvatarProps): JSX.Element {
  const classes = [styles.avatar, styles[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <span {...spanProps} className={classes}>
      {src ? (
        <img className={styles.image} src={src} alt={alt} />
      ) : (
        <span className={styles.fallback} role="img" aria-label={alt}>
          {fallback}
        </span>
      )}
      {status ? (
        <span className={[styles.status, styles[status]].join(' ')}>
          <span className={styles.visuallyHidden}>{statusLabels[status]}</span>
        </span>
      ) : null}
    </span>
  )
}
