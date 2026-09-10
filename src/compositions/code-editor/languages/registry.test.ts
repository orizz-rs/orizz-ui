import { describe, expect, it } from 'vitest'
import { rule } from './rules'
import {
  detectLanguage,
  getLanguage,
  listLanguages,
  registerLanguage,
} from './registry'
import { rustLanguage } from './rust'
import type { LanguageDefinition } from './types'

describe('language registry', () => {
  it('resolves built-in languages by id', () => {
    expect(getLanguage('rust')).toEqual(rustLanguage)
    expect(getLanguage('does-not-exist')).toBeUndefined()
  })

  it('lists languages with plain text first', () => {
    const languages = listLanguages()
    expect(languages[0]?.id).toBe('plaintext')
    expect(languages.length).toBeGreaterThanOrEqual(7)
  })

  it('detects languages from file extensions case-insensitively', () => {
    expect(detectLanguage('main.rs')?.id).toBe('rust')
    expect(detectLanguage('REPORT.JSON')?.id).toBe('json')
    expect(detectLanguage('Makefile')).toBeUndefined()
  })

  it('registers custom definitions as an extension point', () => {
    const custom: LanguageDefinition = {
      id: 'orizz-rules',
      label: 'Orizz Rules',
      extensions: ['.orizz'],
      rules: [rule('keyword', String.raw`approv[e]`)],
    }
    registerLanguage(custom)
    expect(getLanguage('orizz-rules')).toEqual(custom)
    expect(detectLanguage('policy.orizz')?.id).toBe('orizz-rules')
  })
})
