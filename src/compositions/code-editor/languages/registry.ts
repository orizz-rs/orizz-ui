import { javascriptLanguage } from './javascript'
import { jsonLanguage } from './json'
import { plainTextLanguage } from './plaintext'
import { pythonLanguage } from './python'
import { rustLanguage } from './rust'
import { sqlLanguage } from './sql'
import { typescriptLanguage } from './typescript'
import type { LanguageDefinition } from './types'

const BUILT_IN_LANGUAGES: readonly LanguageDefinition[] = [
  plainTextLanguage,
  javascriptLanguage,
  typescriptLanguage,
  jsonLanguage,
  pythonLanguage,
  rustLanguage,
  sqlLanguage,
]

const languages = new Map<string, LanguageDefinition>(
  BUILT_IN_LANGUAGES.map((definition) => [definition.id, definition]),
)

/**
 * Extension point for applications: adds or replaces a definition in the
 * registry so it becomes selectable in the editor language picker.
 */
export function registerLanguage(definition: LanguageDefinition): void {
  languages.set(definition.id, definition)
}

export function getLanguage(id: string): LanguageDefinition | undefined {
  return languages.get(id)
}

export function listLanguages(): readonly LanguageDefinition[] {
  return [...languages.values()]
}

/** Detects a language from a file name extension, e.g. `'main.rs'`. */
export function detectLanguage(fileName: string): LanguageDefinition | undefined {
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex === -1) {
    return undefined
  }
  const extension = fileName.slice(dotIndex).toLowerCase()
  return listLanguages().find((definition) => definition.extensions.includes(extension))
}
