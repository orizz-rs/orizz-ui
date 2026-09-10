import { describe, expect, it } from 'vitest'
import { tokenizeCode } from './tokenizer'
import { typescriptLanguage } from './typescript'
import { pythonLanguage } from './python'
import { rustLanguage } from './rust'
import { plainTextLanguage } from './plaintext'
import type { EditorToken } from './types'

function typesOf(tokens: readonly EditorToken[]): string[] {
  return tokens.map((token) => token.type)
}

describe('tokenizeCode', () => {
  it('classifies TypeScript keywords, strings, numbers and comments', () => {
    const tokens = tokenizeCode('const rate = 2; // total', typescriptLanguage)
    expect(typesOf(tokens)).toEqual([
      'keyword', 'plain', 'operator', 'plain', 'number', 'punctuation', 'plain', 'comment',
    ])
    expect(tokens[0]).toEqual({ type: 'keyword', text: 'const' })
    expect(tokens.at(-1)).toEqual({ type: 'comment', text: '// total' })
  })

  it('does not classify keywords inside identifiers', () => {
    expect(tokenizeCode('pin', pythonLanguage)).toEqual([{ type: 'plain', text: 'pin' }])
  })

  it('classifies Python line comments and literals', () => {
    const tokens = tokenizeCode('# note\nvalue = True', pythonLanguage)
    expect(tokens[0]).toEqual({ type: 'comment', text: '# note' })
    expect(tokens.some((token) => token.type === 'literal' && token.text === 'True')).toBe(true)
  })

  it('classifies Rust functions and types', () => {
    const tokens = tokenizeCode('fn main() -> u32 {', rustLanguage)
    expect(tokens[0]).toEqual({ type: 'keyword', text: 'fn' })
    expect(tokens.some((token) => token.type === 'function' && token.text === 'main')).toBe(true)
    expect(tokens.some((token) => token.type === 'type' && token.text === 'u32')).toBe(true)
  })

  it('returns one plain token for plain text regardless of content', () => {
    const tokens = tokenizeCode('just text 123', plainTextLanguage)
    expect(tokens).toEqual([{ type: 'plain', text: 'just text 123' }])
  })

  it('reproduces the source exactly from concatenated token texts', () => {
    const source = 'let greeting = `hi ${name}`; /* done */\nreturn 0x1f + 1.5e-2;'
    const tokens = tokenizeCode(source, typescriptLanguage)
    expect(tokens.map((token) => token.text).join('')).toBe(source)
  })

  it('is repeatable without regex state leaking between calls', () => {
    const source = 'const first = 1;'
    expect(tokenizeCode(source, typescriptLanguage)).toEqual(
      tokenizeCode(source, typescriptLanguage),
    )
  })
})
