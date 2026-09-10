import { javascriptLanguage } from './javascript'
import { wordRule } from './rules'
import type { EditorTokenRule, LanguageDefinition } from './types'

const KEYWORDS = [
  'abstract', 'any', 'asserts', 'declare', 'implements', 'infer', 'interface',
  'is', 'keyof', 'namespace', 'override', 'private', 'protected', 'public',
  'readonly', 'require', 'satisfies', 'unique', 'unknown',
]

const TYPES = [
  'bigint', 'boolean', 'never', 'number', 'object', 'string', 'symbol',
  'undefined', 'void',
]

// TypeScript reuses the JavaScript tokenizer and prepends its own rules, so
// a change to the shared rules applies to both languages.
const TYPESCRIPT_RULES: readonly EditorTokenRule[] = [
  wordRule('keyword', KEYWORDS),
  wordRule('type', TYPES),
]

export const typescriptLanguage: LanguageDefinition = {
  ...javascriptLanguage,
  id: 'typescript',
  label: 'TypeScript',
  extensions: ['.ts', '.tsx', '.mts', '.cts'],
  rules: [...TYPESCRIPT_RULES, ...javascriptLanguage.rules],
}
