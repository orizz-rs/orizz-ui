import {
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import styles from './Tabs.module.css'

export interface TabItem {
  readonly id: string
  readonly label: ReactNode
  readonly content: ReactNode
  readonly disabled?: boolean
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  readonly items: readonly TabItem[]
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  readonly ariaLabel?: string
}

function findEnabledTab(items: readonly TabItem[], id?: string): TabItem | undefined {
  return items.find((item) => item.id === id && !item.disabled)
}

function findAdjacentTab(
  items: readonly TabItem[],
  currentId: string,
  direction: 1 | -1,
): TabItem | undefined {
  const enabledItems = items.filter((item) => !item.disabled)
  const currentIndex = enabledItems.findIndex((item) => item.id === currentId)

  if (enabledItems.length === 0) return undefined
  if (currentIndex < 0) return enabledItems[0]

  const nextIndex =
    (currentIndex + direction + enabledItems.length) % enabledItems.length
  return enabledItems[nextIndex]
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = 'Tabs',
  className,
  ...divProps
}: TabsProps): JSX.Element {
  const generatedId = useId()
  const firstEnabledTab = items.find((item) => !item.disabled)
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? firstEnabledTab?.id ?? '',
  )
  const requestedTab = findEnabledTab(items, value ?? internalValue)
  const activeTab = requestedTab ?? firstEnabledTab
  const activeId = activeTab?.id ?? ''
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const selectTab = (id: string): void => {
    const tab = findEnabledTab(items, id)
    if (!tab) return
    if (value === undefined) setInternalValue(tab.id)
    onValueChange?.(tab.id)
  }

  const focusTab = (tab?: TabItem): void => {
    if (!tab) return
    selectTab(tab.id)
    tabRefs.current.get(tab.id)?.focus()
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentId: string,
  ): void => {
    let nextTab: TabItem | undefined

    if (event.key === 'ArrowRight') {
      nextTab = findAdjacentTab(items, currentId, 1)
    } else if (event.key === 'ArrowLeft') {
      nextTab = findAdjacentTab(items, currentId, -1)
    } else if (event.key === 'Home') {
      nextTab = items.find((item) => !item.disabled)
    } else if (event.key === 'End') {
      nextTab = items.findLast((item) => !item.disabled)
    } else {
      return
    }

    event.preventDefault()
    focusTab(nextTab)
  }

  const setTabRef = (id: string, node: HTMLButtonElement | null): void => {
    if (node) {
      tabRefs.current.set(id, node)
    } else {
      tabRefs.current.delete(id)
    }
  }

  return (
    <div {...divProps} className={[styles.tabs, className].filter(Boolean).join(' ')}>
      <div className={styles.list} role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId
          const tabId = `${generatedId}-tab-${item.id}`
          const panelId = `${generatedId}-panel-${item.id}`

          return (
            <button
              key={item.id}
              ref={(node) => setTabRef(item.id, node)}
              id={tabId}
              type="button"
              role="tab"
              className={styles.tab}
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => selectTab(item.id)}
              onKeyDown={(event) => handleKeyDown(event, item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {activeTab ? (
        <div
          id={`${generatedId}-panel-${activeTab.id}`}
          className={styles.panel}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`${generatedId}-tab-${activeTab.id}`}
        >
          {activeTab.content}
        </div>
      ) : null}
    </div>
  )
}
