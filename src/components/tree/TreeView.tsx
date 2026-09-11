import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { ChevronRight } from 'lucide-react'
import {
  flattenVisibleTree,
  getDescendantIds,
  type VisibleTreeNode,
} from './TreeView.utils'
import styles from './TreeView.module.css'

export interface TreeNode {
  readonly id: string
  readonly label: ReactNode
  readonly icon?: ReactNode
  readonly children?: readonly TreeNode[]
  readonly disabled?: boolean
}

export interface TreeViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  readonly items: readonly TreeNode[]
  readonly expandedIds?: readonly string[]
  readonly onExpandedChange?: (expandedIds: readonly string[]) => void
  readonly onNodeSelect?: (node: TreeNode) => void
  /** Loads children on first expand; keeps large schemas cheap to render. */
  readonly loadChildren?: (node: TreeNode) => Promise<readonly TreeNode[]>
  readonly ariaLabel?: string
}

const LOADING_ID = '__loading__'

function collectInitialExpandedIds(nodes: readonly TreeNode[]): string[] {
  return nodes.filter((node) => node.children?.length).map((node) => node.id)
}

/**
 * A node behaves like a branch when it already has children (static or
 * lazily loaded) or, while untouched, it is eligible for lazy loading. Once
 * children are loaded as empty the node tracks snapshot state as a leaf.
 */
function isBranch(node: TreeNode, loadedChildren: Readonly<Record<string, readonly TreeNode[]>>, loadChildren: ((node: TreeNode) => Promise<readonly TreeNode[]>) | undefined): boolean {
  const hasLoaded = loadedChildren[node.id] !== undefined
  if (hasLoaded) return (loadedChildren[node.id]?.length ?? 0) > 0
  if ((node.children?.length ?? 0) > 0) return true
  return loadChildren !== undefined
}

export function TreeView({
  items,
  expandedIds,
  onExpandedChange,
  onNodeSelect,
  loadChildren,
  ariaLabel = 'Tree',
  className,
  ...divProps
}: TreeViewProps): JSX.Element {
  const treeId = useId()
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(() =>
    collectInitialExpandedIds(items),
  )
  const [loadedChildren, setLoadedChildren] = useState<
    Readonly<Record<string, readonly TreeNode[]>>
  >({})
  const [loadingIds, setLoadingIds] = useState<ReadonlySet<string>>(new Set())
  const [focusId, setFocusId] = useState<string | null>(null)
  const itemRefs = useRef(new Map<string, HTMLElement>())
  const activeExpandedIds = expandedIds ?? internalExpandedIds

  const visibleNodes = useMemo(
    () => flattenVisibleTree(items, new Set(activeExpandedIds), loadedChildren),
    [activeExpandedIds, items, loadedChildren],
  )
  const loadingNodes = useMemo(
    () =>
      visibleNodes.filter((entry) => loadingIds.has(entry.node.id)).map((entry) => entry.node),
    [loadingIds, visibleNodes],
  )
  const focusTargetId =
    focusId !== null && visibleNodes.some((entry) => entry.node.id === focusId)
      ? focusId
      : (visibleNodes.find((entry) => !entry.node.disabled)?.node.id ?? null)

  useEffect(() => {
    itemRefs.current
      .get(focusTargetId ?? '')
      ?.focus({ preventScroll: false })
  }, [focusTargetId])

  const updateExpandedIds = useCallback(
    (nextIds: readonly string[]): void => {
      if (expandedIds === undefined) setInternalExpandedIds([...nextIds])
      onExpandedChange?.([...nextIds])
    },
    [expandedIds, onExpandedChange],
  )

  const expandNode = useCallback(
    (node: TreeNode): void => {
      const alreadyLoaded =
        loadedChildren[node.id] !== undefined || (node.children?.length ?? 0) > 0
      updateExpandedIds([...new Set([...activeExpandedIds, node.id])])
      if (alreadyLoaded || loadChildren === undefined) return
      setLoadingIds((current) => new Set([...current, node.id]))
      loadChildren(node)
        .then((children) => {
          setLoadedChildren((current) => ({ ...current, [node.id]: children }))
        })
        .catch(() => {
          updateExpandedIds(activeExpandedIds.filter((id) => id !== node.id))
        })
        .finally(() => {
          setLoadingIds((current) => {
            const next = new Set(current)
            next.delete(node.id)
            return next
          })
        })
    },
    [activeExpandedIds, loadChildren, loadedChildren, updateExpandedIds],
  )

  const toggleNode = useCallback(
    (node: TreeNode): void => {
      if (activeExpandedIds.includes(node.id)) {
        const collapsedIds = new Set(getDescendantIds(items, node.id))
        updateExpandedIds(
          activeExpandedIds.filter((id) => id !== node.id && !collapsedIds.has(id)),
        )
        return
      }
      expandNode(node)
    },
    [activeExpandedIds, expandNode, items, updateExpandedIds],
  )

  const handleNodeClick = (entry: VisibleTreeNode): void => {
    const { node } = entry
    if (node.disabled) return
    setFocusId(node.id)
    if (isBranch(node, loadedChildren, loadChildren)) {
      toggleNode(node)
    }
    onNodeSelect?.(node)
  }

  const focusOffset = (offset: number): void => {
    const currentIndex = visibleNodes.findIndex(
      (entry) => entry.node.id === focusTargetId,
    )
    const startIndex = currentIndex === -1 ? 0 : currentIndex + offset
    const direction = offset >= 0 ? 1 : -1
    for (let i = startIndex; i >= 0 && i < visibleNodes.length; i += direction) {
      const candidate = visibleNodes[i]?.node
      if (candidate !== undefined && !candidate.disabled) {
        setFocusId(candidate.id)
        return
      }
    }
  }

  const focusEdge = (startIndex: number, direction: number): void => {
    for (let i = startIndex; i >= 0 && i < visibleNodes.length; i += direction) {
      const candidate = visibleNodes[i]?.node
      if (candidate !== undefined && !candidate.disabled) {
        setFocusId(candidate.id)
        return
      }
    }
  }

  const findEntry = (nodeId: string | null): VisibleTreeNode | undefined =>
    visibleNodes.find((entry) => entry.node.id === nodeId)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const entry = findEntry(focusTargetId)
    if (entry === undefined) return
    const { node } = entry

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusOffset(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        focusOffset(-1)
        break
      case 'ArrowRight':
        event.preventDefault()
        if (
          isBranch(node, loadedChildren, loadChildren) &&
          !activeExpandedIds.includes(node.id)
        ) {
          toggleNode(node)
        } else {
          focusOffset(1)
        }
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (activeExpandedIds.includes(node.id)) {
          toggleNode(node)
        } else if (entry.level > 1) {
          const parentIndex = visibleNodes.findIndex(
            (candidate, index) =>
              index < visibleNodes.indexOf(entry) &&
              candidate.level === entry.level - 1,
          )
          const parent = visibleNodes[parentIndex]?.node
          if (parent !== undefined) setFocusId(parent.id)
        }
        break
      case 'Home':
        event.preventDefault()
        focusEdge(0, 1)
        break
      case 'End':
        event.preventDefault()
        focusEdge(visibleNodes.length - 1, -1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleNodeClick(entry)
        break
      default:
        break
    }
  }

  return (
    <div
      {...divProps}
      role="tree"
      aria-label={ariaLabel}
      className={[styles.tree, className].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
    >
      {visibleNodes.map((entry) => {
        const { node, level } = entry
        const expanded = activeExpandedIds.includes(node.id)
        const isLoading = loadingIds.has(node.id)
        const branch = isBranch(node, loadedChildren, loadChildren) || isLoading
        const itemId = `${treeId}-${node.id}`
        return (
          <div
            key={node.id}
            ref={(element) => {
              if (element === null) itemRefs.current.delete(node.id)
              else itemRefs.current.set(node.id, element)
            }}
            id={itemId}
            role="treeitem"
            aria-level={level}
            aria-expanded={branch ? expanded : undefined}
            aria-disabled={node.disabled || undefined}
            tabIndex={node.id === focusTargetId ? 0 : -1}
            className={[
              styles.item,
              node.disabled ? styles.disabled : undefined,
              branch ? styles.branch : styles.leaf,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ '--tree-level': level - 1 } as React.CSSProperties}
            onClick={() => handleNodeClick(entry)}
            onFocus={() => setFocusId(node.id)}
          >
            <span className={styles.content}>
              {branch ? (
                <ChevronRight
                  className={expanded ? styles.chevronExpanded : styles.chevron}
                  aria-hidden="true"
                />
              ) : (
                <span className={styles.chevronPlaceholder} aria-hidden="true" />
              )}
              {node.icon ? (
                <span className={styles.icon} aria-hidden="true">
                  {node.icon}
                </span>
              ) : null}
              <span className={styles.label}>{node.label}</span>
            </span>
          </div>
        )
      })}
      {loadingNodes.length > 0 ? (
        <div role="status" className={styles.loading}>
          Loading…
        </div>
      ) : null}
      {visibleNodes.length === 0 ? <div className={styles.empty}>No items</div> : null}
      <span id={`${treeId}-${LOADING_ID}`} hidden>
        {loadingNodes.map((node) => node.label).join(', ')}
      </span>
    </div>
  )
}
