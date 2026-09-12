import type { DbNode } from './schema.types'

/** Pure label helpers for the schema tree. No React, no DOM. */

export function isDbColumn(node: DbNode): boolean {
  return node.type === 'column'
}

export function formatDbNodeLabel(node: DbNode, showColumnTypes = true): string {
  if (isDbColumn(node) && showColumnTypes && node.dataType !== undefined) {
    return `${node.name} (${node.dataType})`
  }
  return node.name
}