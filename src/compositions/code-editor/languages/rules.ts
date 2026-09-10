import type { EditorTokenRule, EditorTokenType } from './types'

/**
 * Helpers for declaring tokenizer rules in language data files. They only
 * construct data, so language files stay declarative and framework-free.
 */

/** Builds a sticky rule from a regex source string. */
export function rule(type: EditorTokenType, source: string, flags = ''): EditorTokenRule {
  return { type, pattern: new RegExp(source, `y${flags}`) }
}

/**
 * Builds a sticky whole-word rule matching any of `words`. The words are
 * escaped, so tokens like `->` are safe to include.
 */
export function wordRule(
  type: EditorTokenType,
  words: readonly string[],
  flags = '',
): EditorTokenRule {
  const alternation = words
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  return { type, pattern: new RegExp(`\\b(?:${alternation})\\b`, `y${flags}`) }
}
