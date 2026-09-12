/**
 * Data contracts of the results grid. No React, no DOM.
 */

export type ResultGridExportFormat = 'csv' | 'xlsx'

export interface ResultColumn {
  readonly id: string
  readonly name: string
  readonly dbType?: string
  readonly nullable?: boolean
}