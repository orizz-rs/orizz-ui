import type {
  DataTableColumn,
  DataTableColumnFilter,
  DataTableFilterOption,
} from './DataTable.types'
import { formatDataTableValue } from './DataTable.utils'

const hiddenKeys = new Set(['id', '_id'])
const categoricalKeyPattern = /(^|\s)(status|state|type|role|category|priority)$/i

function readValue(row: object, key: string): unknown {
  return Reflect.get(row, key)
}

function humanize(value: string): string {
  const words = value
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
  return words ? `${words.charAt(0).toLocaleUpperCase()}${words.slice(1)}` : value
}

function serializeFilterValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toISOString()
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) return String(value)
  return ''
}

function createOptions(values: readonly unknown[]): readonly DataTableFilterOption[] {
  const options = new Map<string, string>()
  values.forEach((value) => {
    const serialized = serializeFilterValue(value)
    if (!serialized || options.has(serialized)) return
    const label = typeof value === 'boolean'
      ? (value ? 'Yes' : 'No')
      : humanize(serialized)
    options.set(serialized, label)
  })
  return [...options].map(([value, label]) => ({ value, label }))
}

function inferFilter(
  key: string,
  values: readonly unknown[],
): DataTableColumnFilter | undefined {
  const scalarValues = values.filter(
    (value) => value !== null && value !== undefined,
  )
  if (scalarValues.length === 0) return undefined
  const isScalar = scalarValues.every(
    (value) =>
      value instanceof Date ||
      ['string', 'number', 'boolean', 'bigint'].includes(typeof value),
  )
  if (!isScalar) return undefined

  const options = createOptions(scalarValues)
  const isBoolean = scalarValues.every((value) => typeof value === 'boolean')
  const isTextual = scalarValues.every((value) => typeof value === 'string')
  const isCategoricalKey = categoricalKeyPattern.test(humanize(key))
  const hasRepeatedValues = options.length < scalarValues.length
  if (
    options.length > 0 &&
    options.length <= 8 &&
    (isBoolean || isCategoricalKey || (isTextual && hasRepeatedValues))
  ) {
    return { type: 'select', options }
  }
  return { type: 'text' }
}

function isNumericColumn(values: readonly unknown[]): boolean {
  const presentValues = values.filter(
    (value) => value !== null && value !== undefined,
  )
  return presentValues.length > 0 && presentValues.every(
    (value) => typeof value === 'number' || typeof value === 'bigint',
  )
}

export function createDataTableColumns<T extends object>(
  data: readonly T[],
): readonly DataTableColumn<T>[] {
  const keys = new Set<string>()
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (!hiddenKeys.has(key)) keys.add(key)
    })
  })

  return [...keys].map((key) => {
    const values = data.map((row) => readValue(row, key))
    const filter = inferFilter(key, values)
    return {
      id: key,
      header: humanize(key),
      cell: (row) => formatDataTableValue(readValue(row, key)),
      align: isNumericColumn(values) ? 'end' : 'start',
      required: false,
      sortable: true,
      sortValue: (row) => readValue(row, key),
      filter,
      filterValue: filter
        ? (row) => serializeFilterValue(readValue(row, key))
        : undefined,
    }
  })
}
