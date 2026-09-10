import type { LanguageDefinition } from './types'

/** Fallback definition that renders source text without classification. */
export const plainTextLanguage: LanguageDefinition = {
  id: 'plaintext',
  label: 'Plain text',
  extensions: [],
  rules: [],
}
