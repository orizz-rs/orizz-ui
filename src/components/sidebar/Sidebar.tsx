import type { HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './Sidebar.module.css'

export interface SidebarItem {
  readonly id: string
  readonly label: ReactNode
  readonly icon?: ReactNode
  readonly href?: string
  readonly active?: boolean
  readonly disabled?: boolean
  readonly onSelect?: () => void
}

export interface SidebarGroup {
  readonly id: string
  readonly label?: ReactNode
  readonly items: readonly SidebarItem[]
}

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  readonly groups: readonly SidebarGroup[]
  readonly collapsed?: boolean
  readonly onItemSelect?: (item: SidebarItem) => void
  readonly ariaLabel?: string
}

export function Sidebar({
  groups,
  collapsed = false,
  onItemSelect,
  ariaLabel = 'Sidebar navigation',
  className,
  ...asideProps
}: SidebarProps): JSX.Element {
  return (
    <aside
      {...asideProps}
      className={[styles.sidebar, collapsed ? styles.collapsed : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-label={ariaLabel}
      data-collapsed={collapsed || undefined}
    >
      <nav>
        {groups.map((group) => (
          <div className={styles.group} key={group.id}>
            {group.label ? <p className={styles.groupLabel}>{group.label}</p> : null}
            <ul className={styles.list}>
              {group.items.map((item) => {
                const classNames = [styles.item, item.active ? styles.active : '']
                  .filter(Boolean)
                  .join(' ')
                const content = (
                  <>
                    {item.icon ? <span className={styles.icon} aria-hidden="true">{item.icon}</span> : null}
                    <span className={styles.label}>{item.label}</span>
                  </>
                )
                const handleSelect = (): void => {
                  item.onSelect?.()
                  onItemSelect?.(item)
                }

                return (
                  <li key={item.id}>
                    {item.href ? (
                      <a className={classNames} href={item.href} aria-current={item.active ? 'page' : undefined} aria-disabled={item.disabled || undefined} onClick={item.disabled ? (event) => event.preventDefault() : handleSelect}>
                        {content}
                      </a>
                    ) : (
                      <button className={classNames} type="button" disabled={item.disabled} aria-current={item.active ? 'page' : undefined} onClick={handleSelect}>
                        {content}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
