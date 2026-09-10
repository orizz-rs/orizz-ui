import type { EditorToken, EditorTokenRule, LanguageDefinition } from './types'

/**
 * Pure tokenizer engine shared by every language definition. It never mutates
 * the definition it receives: sticky regexes are stateful, so each definition
 * gets private compiled copies cached by object identity.
 */

interface CompiledLanguage {
  readonly rules: readonly EditorTokenRule[]
}

const compiledLanguages = new WeakMap<LanguageDefinition, CompiledLanguage>()

function compileLanguage(language: LanguageDefinition): CompiledLanguage {
  const cached = compiledLanguages.get(language)
  if (cached !== undefined) {
    return cached
  }
  const rules = language.rules.map((entry) => ({
    type: entry.type,
    pattern: new RegExp(entry.pattern.source, entry.pattern.flags),
  }))
  const compiled: CompiledLanguage = { rules }
  compiledLanguages.set(language, compiled)
  return compiled
}

/**
 * Classifies `source` with the ordered rules of `language`. Unmatched
 * characters are grouped into `plain` tokens, so the concatenated token texts
 * always reproduce the source exactly.
 */
export function tokenizeCode(source: string, language: LanguageDefinition): readonly EditorToken[] {
  const { rules } = compileLanguage(language)
  const tokens: EditorToken[] = []
  let position = 0
  let plainStart = 0

  while (position < source.length) {
    let matchedType: EditorToken['type'] | undefined
    let matchedLength = 0

    for (const { type, pattern } of rules) {
      pattern.lastIndex = position
      const match = pattern.exec(source)
      if (match !== null && match[0].length > 0) {
        matchedType = type
        matchedLength = match[0].length
        break
      }
    }

    if (matchedType === undefined) {
      position += 1
      continue
    }

    if (position > plainStart) {
      tokens.push({ type: 'plain', text: source.slice(plainStart, position) })
    }
    tokens.push({ type: matchedType, text: source.slice(position, position + matchedLength) })
    position += matchedLength
    plainStart = position
  }

  if (position > plainStart) {
    tokens.push({ type: 'plain', text: source.slice(plainStart, position) })
  }
  return tokens
}
