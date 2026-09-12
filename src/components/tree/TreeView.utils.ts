import type { TreeNode } from './TreeView'

/** A tree node flattened into the ordered list of currently visible rows. */
export interface VisibleTreeNode {
  readonly node: TreeNode
  readonly level: number
  readonly hasChildren: boolean
}

/**
 * Flattens the tree into visible row order: children of collapsed nodes are
 * skipped. Children loaded through `loadChildren` (lazy) take precedence
 * over the static `children` array.
 */
export function flattenVisibleTree(
  nodes: readonly TreeNode[],
  expandedIds: ReadonlySet<string>,
  loadedChildren: Readonly<Record<string, readonly TreeNode[]>>,
): readonly VisibleTreeNode[] {
  const visible: VisibleTreeNode[] = []

  const visit = (items: readonly TreeNode[], level: number): void => {
    for (const node of items) {
      const children = loadedChildren[node.id] ?? node.children ?? []
      const hasChildren = children.length > 0 || node.hasChildren === true
      visible.push({ node, level, hasChildren })
      if (children.length > 0 && expandedIds.has(node.id)) {
        visit(children, level + 1)
      }
    }
  }

  visit(nodes, 1)
  return visible
}

/** All descendant node ids of `id`, used to prune expanded ids when a branch collapses. */
export function getDescendantIds(
  nodes: readonly TreeNode[],
  id: string,
): readonly string[] {
  const ids: string[] = []

  const visit = (items: readonly TreeNode[]): void => {
    for (const node of items) {
      ids.push(node.id)
      if (node.children !== undefined) visit(node.children)
    }
  }

  for (const node of nodes) {
    if (node.id === id) {
      if (node.children !== undefined) visit(node.children)
      break
    }
  }
  return ids
}
