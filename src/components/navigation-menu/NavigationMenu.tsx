import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './NavigationMenu.module.css'

export interface NavigationMenuItem {
  readonly id: string
  readonly label: ReactNode
  readonly href?: string
  readonly active?: boolean
  readonly disabled?: boolean
  readonly onSelect?: () => void
}

export interface NavigationMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  readonly items: readonly NavigationMenuItem[]
  readonly onItemSelect?: (item: NavigationMenuItem) => void
  readonly ariaLabel?: string
}

export function NavigationMenu({ items, onItemSelect, ariaLabel = 'Primary navigation', className, ...navProps }: NavigationMenuProps): JSX.Element {
  return <nav {...navProps} className={[styles.menu, className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
    <ul className={styles.list}>
      {items.map((item) => {
        const classNameForItem = [styles.item, item.active ? styles.active : ''].filter(Boolean).join(' ')
        const handleSelect = (): void => { item.onSelect?.(); onItemSelect?.(item) }
        return <li key={item.id}>
          {item.href ? <a className={classNameForItem} href={item.href} aria-current={item.active ? 'page' : undefined} aria-disabled={item.disabled || undefined} onClick={item.disabled ? (event) => event.preventDefault() : handleSelect}>{item.label}</a> : <button className={classNameForItem} type="button" disabled={item.disabled} aria-current={item.active ? 'page' : undefined} onClick={handleSelect}>{item.label}</button>}
        </li>
      })}
    </ul>
  </nav>
}
