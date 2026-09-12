/**
 * Data layer of the schema browser: pure contracts describing the object tree
 * of a database connection. No React, no DOM.
 */

export type DbObjectType = 'catalog' | 'schema' | 'table' | 'view' | 'column'

export interface DbNode {
  readonly id: string
  readonly name: string
  readonly type: DbObjectType
  /** Column cells only: the database data type, e.g. `uuid` or `numeric(10,2)`. */
  readonly dataType?: string
  /** Column cells only: whether the column accepts NULL. */
  readonly nullable?: boolean
  /** Column cells only: whether this column is part of the primary key. */
  readonly isPrimaryKey?: boolean
}