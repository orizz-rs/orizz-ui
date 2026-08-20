import type {
  FieldsetHTMLAttributes,
  JSX,
  ReactNode,
} from 'react'
import styles from './Fieldset.module.css'

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  readonly legend: ReactNode
  readonly description?: ReactNode
  readonly children: ReactNode
}

export function Fieldset({
  legend,
  description,
  className,
  children,
  ...fieldsetProps
}: FieldsetProps): JSX.Element {
  const classes = [styles.fieldset, className].filter(Boolean).join(' ')

  return (
    <fieldset {...fieldsetProps} className={classes}>
      <legend className={styles.legend}>{legend}</legend>
      {description ? <p className={styles.description}>{description}</p> : null}
      <div className={styles.content}>{children}</div>
    </fieldset>
  )
}
