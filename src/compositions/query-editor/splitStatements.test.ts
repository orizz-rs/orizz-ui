import { describe, expect, it } from 'vitest'
import { splitStatements } from './splitStatements'

describe('splitStatements', () => {
  it('splits statements on semicolons', () => {
    expect(
      splitStatements('SELECT 1;\nSELECT 2;\nSELECT 3'),
    ).toEqual(['SELECT 1', 'SELECT 2', 'SELECT 3'])
  })

  it('ignores empty slices and trailing text without a semicolon', () => {
    expect(splitStatements('  ; \n SELECT 1 ;;\n;')).toEqual(['SELECT 1'])
  })

  it('keeps semicolons that live inside string literals', () => {
    const sql = "SELECT 'a;b' AS value; SELECT 2"
    expect(splitStatements(sql)).toEqual([
      "SELECT 'a;b' AS value",
      'SELECT 2',
    ])
  })

  it('ignores semicolons inside double-quoted and backtick identifiers', () => {
    expect(
      splitStatements('SELECT "a;b" FROM `t;t`; SELECT 2'),
    ).toEqual(['SELECT "a;b" FROM `t;t`', 'SELECT 2'])
  })

  it('handles escaped quotes inside string literals', () => {
    const sql = "SELECT 'it''s ; here'; SELECT 2"
    expect(splitStatements(sql)).toEqual(["SELECT 'it''s ; here'", 'SELECT 2'])
  })

  it('ignores semicolons inside line comments and keeps code after them', () => {
    const sql = 'SELECT 1; -- trailing ; comment\nSELECT 2'
    expect(splitStatements(sql)).toEqual([
      'SELECT 1',
      '-- trailing ; comment\nSELECT 2',
    ])
  })

  it('drops statements made entirely of comments', () => {
    expect(splitStatements('-- just a comment')).toEqual([])
    expect(splitStatements('  /* block only */  ')).toEqual([])
  })

  it('ignores semicolons inside block comments', () => {
    const sql = 'SELECT 1 /* a; b */; SELECT 2'
    expect(splitStatements(sql)).toEqual(['SELECT 1 /* a; b */', 'SELECT 2'])
  })

  it('returns an empty array for whitespace or empty input', () => {
    expect(splitStatements('')).toEqual([])
    expect(splitStatements('   \n\t  ')).toEqual([])
  })
})