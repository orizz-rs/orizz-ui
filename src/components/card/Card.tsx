import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './Card.module.css'

export type CardVariant = 'default' | 'outlined' | 'elevated'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly variant?: CardVariant
  readonly padding?: CardPadding
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  readonly children?: ReactNode
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  ...divProps
}: CardProps): JSX.Element {
  const classes = [styles.card, styles[variant], styles[padding], className]
    .filter(Boolean)
    .join(' ')

  return <div {...divProps} className={classes} />
}

export function CardHeader({
  className,
  ...divProps
}: CardSectionProps): JSX.Element {
  return <div {...divProps} className={[styles.header, className].filter(Boolean).join(' ')} />
}

export function CardContent({
  className,
  ...divProps
}: CardSectionProps): JSX.Element {
  return <div {...divProps} className={[styles.content, className].filter(Boolean).join(' ')} />
}

export function CardFooter({
  className,
  ...divProps
}: CardSectionProps): JSX.Element {
  return <div {...divProps} className={[styles.footer, className].filter(Boolean).join(' ')} />
}
