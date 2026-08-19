import { useId, useState, type HTMLAttributes, type JSX, type ReactNode } from 'react'
import styles from './Accordion.module.css'

export interface AccordionItem { readonly id: string; readonly title: ReactNode; readonly content: ReactNode; readonly disabled?: boolean }
export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> { readonly items: readonly AccordionItem[]; readonly value?: string; readonly defaultValue?: string; readonly onValueChange?: (value: string | undefined) => void; readonly multiple?: boolean }

export function Accordion({ items, value, defaultValue, onValueChange, multiple = false, className, ...divProps }: AccordionProps): JSX.Element {
  const baseId = useId()
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue)
  const selectedValue = value !== undefined ? value : internalValue
  const openIds = multiple ? new Set((selectedValue ?? '').split(',').filter(Boolean)) : new Set(selectedValue ? [selectedValue] : [])
  const toggle = (id: string): void => {
    const next = new Set(openIds)
    if (next.has(id)) next.delete(id); else { if (!multiple) next.clear(); next.add(id) }
    const nextValue = multiple ? [...next].join(',') || undefined : [...next][0]
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }
  return <div {...divProps} className={[styles.accordion, className].filter(Boolean).join(' ')}>
    {items.map((item) => { const open = openIds.has(item.id); const triggerId = `${baseId}-trigger-${item.id}`; const panelId = `${baseId}-panel-${item.id}`; return <section className={styles.item} key={item.id}>
      <h3 className={styles.heading}><button id={triggerId} className={styles.trigger} type="button" aria-expanded={open} aria-controls={panelId} disabled={item.disabled} onClick={() => toggle(item.id)}><span>{item.title}</span><span className={styles.chevron} aria-hidden="true">+</span></button></h3>
      <div id={panelId} className={styles.panel} role="region" aria-labelledby={triggerId} hidden={!open}>{item.content}</div>
    </section> })}
  </div>
}
