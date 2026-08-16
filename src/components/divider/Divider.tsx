import type { HTMLAttributes, JSX } from 'react'
import styles from './Divider.module.css'

export type DividerOrientation = 'horizontal' | 'vertical'

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  readonly orientation?: DividerOrientation
  readonly decorative?: boolean
}

export function Divider({
  orientation = 'horizontal',
  decorative = false,
  className,
  ...hrProps
}: DividerProps): JSX.Element {
  const classes = [styles.divider, styles[orientation], className]
    .filter(Boolean)
    .join(' ')

  return (
    <hr
      {...hrProps}
      className={classes}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
    />
  )
}
