import { useCallback, useMemo, type HTMLAttributes, type JSX } from 'react'
import {
  Columns3,
  Database,
  Eye,
  Folder,
  KeyRound,
  Table as TableIcon,
} from 'lucide-react'
import { TreeView, type TreeNode } from '../../components/tree'
import type { DbNode } from './schema.types'
import { formatDbNodeLabel } from './schema.utils'
import styles from './SchemaTree.module.css'

interface RegisteredTreeNode extends TreeNode {
  readonly dbNode: DbNode
}

export interface SchemaTreeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Root nodes of the database object tree; children are loaded lazily. */
  readonly items: readonly DbNode[]
  readonly expandedIds?: readonly string[]
  readonly onExpandedChange?: (expandedIds: readonly string[]) => void
  readonly onNodeSelect?: (node: DbNode) => void
  /** Loads the children of a node on first expand. */
  readonly loadChildren?: (node: DbNode) => Promise<readonly DbNode[]>
  /** Shows `name (type)` for column nodes. */
  readonly showColumnTypes?: boolean
  readonly ariaLabel?: string
}

function nodeIcon(node: DbNode): JSX.Element | undefined {
  if (node.type === 'column') {
    return node.isPrimaryKey === true ? (
      <KeyRound size={14} aria-hidden="true" />
    ) : (
      <Columns3 size={14} aria-hidden="true" />
    )
  }
  if (node.type === 'catalog') return <Database size={14} aria-hidden="true" />
  if (node.type === 'schema') return <Folder size={14} aria-hidden="true" />
  if (node.type === 'view') return <Eye size={14} aria-hidden="true" />
  return <TableIcon size={14} aria-hidden="true" />
}

/**
 * Renders a database object tree (catalog / schema / table / view / column)
 * on top of the `TreeView` primitive. `DbNode` stays in the data layer; this
 * component only maps it onto the visual tree shape.
 */
export function SchemaTree({
  items,
  expandedIds,
  onExpandedChange,
  onNodeSelect,
  loadChildren,
  showColumnTypes = true,
  ariaLabel = 'Database schema',
  className,
  ...divProps
}: SchemaTreeProps): JSX.Element {
  const toTreeNode = useCallback(
    (node: DbNode): RegisteredTreeNode => ({
      id: node.id,
      label: formatDbNodeLabel(node, showColumnTypes),
      icon: nodeIcon(node),
      children: [],
      dbNode: node,
    }),
    [showColumnTypes],
  )

  const treeItems = useMemo(
    () => items.map((node) => toTreeNode(node)),
    [items, toTreeNode],
  )

  const handleLoadChildren = useCallback(
    (treeNode: TreeNode): Promise<readonly TreeNode[]> => {
      const dbNode = (treeNode as { readonly dbNode?: DbNode }).dbNode
      if (dbNode === undefined || loadChildren === undefined) {
        return Promise.resolve([])
      }
      return loadChildren(dbNode).then((children) =>
        children.map((node) => toTreeNode(node)),
      )
    },
    [loadChildren, toTreeNode],
  )

  const handleNodeSelect = useCallback(
    (treeNode: TreeNode): void => {
      const dbNode = (treeNode as { readonly dbNode?: DbNode }).dbNode
      if (dbNode !== undefined) onNodeSelect?.(dbNode)
    },
    [onNodeSelect],
  )

  return (
    <TreeView
      {...divProps}
      className={[styles.schemaTree, className].filter(Boolean).join(' ')}
      items={treeItems}
      expandedIds={expandedIds}
      onExpandedChange={onExpandedChange}
      onNodeSelect={handleNodeSelect}
      loadChildren={loadChildren !== undefined ? handleLoadChildren : undefined}
      ariaLabel={ariaLabel}
    />
  )
}