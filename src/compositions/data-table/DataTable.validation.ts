import type {
  DataTableColumn,
  DataTableFilterOption,
  DataTableValidationIssue,
} from './DataTable.types'
import { getDataTableValue } from './DataTable.utils'

function isMissingValue(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  )
}

function findDuplicates(values: readonly string[]): readonly string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  values.forEach((value) => {
    if (seen.has(value)) duplicates.add(value)
    seen.add(value)
  })
  return [...duplicates]
}

function isValidFilterOption(option: unknown): option is DataTableFilterOption {
  return (
    typeof option === 'object' &&
    option !== null &&
    'value' in option &&
    typeof option.value === 'string' &&
    option.value.trim() !== '' &&
    'label' in option &&
    typeof option.label === 'string' &&
    option.label.trim() !== ''
  )
}

function validateColumn<T extends object>(
  column: DataTableColumn<T>,
): readonly DataTableValidationIssue[] {
  const issues: DataTableValidationIssue[] = []
  if (column.header === null || column.header === undefined || column.header === '') {
    issues.push({
      id: `missing-column-header:${column.id}`,
      code: 'missing-column-header',
      columnId: column.id,
      message: `Column "${column.id}" is missing its header.`,
    })
  }
  if (column.accessor === undefined && column.cell === undefined) {
    issues.push({
      id: `missing-column-source:${column.id}`,
      code: 'missing-column-source',
      columnId: column.id,
      message: `Column "${column.id}" needs an accessor or cell renderer.`,
    })
  }
  if (
    column.filter !== undefined &&
    column.accessor === undefined &&
    column.filterValue === undefined
  ) {
    issues.push({
      id: `missing-filter-source:${column.id}`,
      code: 'missing-filter-source',
      columnId: column.id,
      message: `Filter for column "${column.id}" needs an accessor or filterValue.`,
    })
  }
  if (!column.filter) return issues
  if (column.filter.type !== 'text' && column.filter.type !== 'select') {
    issues.push({
      id: `invalid-filter-type:${column.id}`,
      code: 'invalid-filter-type',
      columnId: column.id,
      message: `Filter for column "${column.id}" must use type "text" or "select".`,
    })
    return issues
  }
  if (column.filter.type === 'text') return issues

  const options: readonly unknown[] = Array.isArray(column.filter.options)
    ? column.filter.options
    : []
  if (options.length === 0) {
    issues.push({
      id: `missing-filter-options:${column.id}`,
      code: 'missing-filter-options',
      columnId: column.id,
      message: `Select filter for column "${column.id}" needs at least one option.`,
    })
  }
  const validOptions = options.filter(isValidFilterOption)
  const invalidOptionCount = options.length - validOptions.length
  if (invalidOptionCount > 0) {
    issues.push({
      id: `invalid-filter-option:${column.id}`,
      code: 'invalid-filter-option',
      columnId: column.id,
      message: `Select filter for column "${column.id}" has ${invalidOptionCount} option(s) with an empty value or label.`,
    })
  }
  findDuplicates(validOptions.map((option) => option.value)).forEach(
    (value) => issues.push({
      id: `duplicate-filter-option-value:${column.id}:${value}`,
      code: 'duplicate-filter-option-value',
      columnId: column.id,
      message: `Select filter for column "${column.id}" duplicates option value "${value}".`,
    }),
  )
  return issues
}

export function validateDataTable<T extends object>(
  columns: readonly DataTableColumn<T>[],
  data: readonly T[],
  getRowId: (row: T) => string,
): readonly DataTableValidationIssue[] {
  const issues: DataTableValidationIssue[] = []
  findDuplicates(columns.map((column) => column.id)).forEach((columnId) => {
    issues.push({
      id: `duplicate-column-id:${columnId}`,
      code: 'duplicate-column-id',
      columnId,
      message: `Column ID "${columnId}" is duplicated.`,
    })
  })
  columns.forEach((column) => issues.push(...validateColumn(column)))

  const rowIds = data.map(getRowId)
  const missingRowIdCount = rowIds.filter((rowId) => !rowId.trim()).length
  if (missingRowIdCount > 0) {
    issues.push({
      id: 'missing-row-id',
      code: 'missing-row-id',
      message: `${missingRowIdCount} row(s) are missing a stable row ID.`,
    })
  }
  findDuplicates(rowIds.filter(Boolean)).forEach((rowId) => issues.push({
    id: `duplicate-row-id:${rowId}`,
    code: 'duplicate-row-id',
    message: `Row ID "${rowId}" is duplicated.`,
  }))

  columns.forEach((column) => {
    const shouldValidate = column.required ?? column.accessor !== undefined
    if (!shouldValidate || column.accessor === undefined) return
    const missingRows = data.filter(
      (row) => isMissingValue(getDataTableValue(row, column)),
    )
    if (missingRows.length === 0) return
    const rowLabels = missingRows.map(getRowId).filter(Boolean)
    const unidentifiedCount = missingRows.length - rowLabels.length
    const identifiedRows = rowLabels.length > 0 ? rowLabels.join(', ') : 'none'
    const unidentified = unidentifiedCount > 0
      ? `; ${unidentifiedCount} unidentified row(s)`
      : ''
    issues.push({
      id: `missing-required-value:${column.id}`,
      code: 'missing-required-value',
      columnId: column.id,
      message: `Column "${column.id}" is missing required values in rows: ${identifiedRows}${unidentified}.`,
    })
  })
  return issues
}

export function hasBlockingValidationIssue(
  issues: readonly DataTableValidationIssue[],
): boolean {
  return issues.some((issue) => issue.code !== 'missing-required-value')
}
