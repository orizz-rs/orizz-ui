import { describe, expect, it } from 'vitest'
import { formatCellValue, isNumericColumn, compareGridValues, findNonNullSample } from './ResultsGrid.utils'
import type { ResultColumn } from './ResultsGrid.types'

describe('formatCellValue', () => {
  it('renders NULL for null and undefined', () => {
    expect(formatCellValue(null)).toEqual({ text: 'NULL', isNull: true })
    expect(formatCellValue(undefined)).toEqual({ text: 'NULL', isNull: true })
  })

  it('renders booleans as lower-case text', () => {
    expect(formatCellValue(true)).toEqual({ text: 'true', isNull: false })
    expect(formatCellValue(false)).toEqual({ text: 'false', isNull: false })
  })

  it('formats dates as ISO strings', () => {
    const date = new Date('2026-03-01T12:00:00Z')
    expect(formatCellValue(date)).toEqual({ text: '2026-03-01T12:00:00.000Z', isNull: false })
  })

  it('converts numbers and bigints to strings', () => {
    expect(formatCellValue(42)).toEqual({ text: '42', isNull: false })
    expect(formatCellValue(BigInt(12345))).toEqual({ text: '12345', isNull: false })
  })

  it('JSON-serialises complex values', () => {
    const nested = { a: [1, 2] }
    expect(formatCellValue(nested)).toEqual({ text: '{"a":[1,2]}', isNull: false })
  })
})

describe('isNumericColumn', () => {
  it('detects numeric columns from the sample value', () => {
    const col: ResultColumn = { id: 'x', name: 'x' }
    expect(isNumericColumn(col, 42)).toBe(true)
    expect(isNumericColumn(col, 'text')).toBe(false)
    expect(isNumericColumn(col, new Date())).toBe(false)
  })

  it('detects numeric columns from the dbType', () => {
    const intCol: ResultColumn = { id: 'x', name: 'x', dbType: 'integer' }
    const txtCol: ResultColumn = { id: 'y', name: 'y', dbType: 'text' }
    expect(isNumericColumn(intCol, undefined)).toBe(true)
    expect(isNumericColumn(txtCol, undefined)).toBe(false)
  })

  it('handles parameterised dbType like numeric(12,2)', () => {
    const col: ResultColumn = { id: 'x', name: 'x', dbType: 'numeric(12,2)' }
    expect(isNumericColumn(col, undefined)).toBe(true)
  })
})

describe('compareGridValues', () => {
  it('sorts numbers ascending', () => {
    expect(compareGridValues(1, 2)).toBeLessThan(0)
    expect(compareGridValues(2, 1)).toBeGreaterThan(0)
    expect(compareGridValues(3, 3)).toBe(0)
  })

  it('sorts strings using localeCompare', () => {
    expect(compareGridValues('a', 'b')).toBeLessThan(0)
  })

  it('places nulls first', () => {
    expect(compareGridValues(null, 1)).toBe(-1)
    expect(compareGridValues(1, null)).toBe(1)
  })
})

describe('findNonNullSample', () => {
  it('returns the first non-null value from a column', () => {
    const rows = [{ x: null }, { x: 'hello' }, { x: 'world' }]
    expect(findNonNullSample(rows, 'x')).toBe('hello')
  })

  it('returns undefined when all values are null', () => {
    expect(findNonNullSample([{ x: null }, { x: undefined }], 'x')).toBeUndefined()
  })
})