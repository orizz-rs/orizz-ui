// Data contract for editor language support. This layer stays framework-free:
// no React, no DOM, no component imports are allowed here.

/** Semantic kind assigned to each token the tokenizer produces. */
export type EditorTokenType =
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'type'
  | 'property'
  | 'literal'
  | 'function'
  | 'operator'
  | 'punctuation'
  | 'plain'

/** A single span of classified source text. */
export interface EditorToken {
  readonly type: EditorTokenType
  readonly text: string
}

/**
 * One tokenizer rule. The pattern must be a sticky regex (`y` flag); the
 * engine only accepts matches anchored at the current scan position and
 * ignores empty matches. Rules are tried in order and the first match wins.
 */
export interface EditorTokenRule {
  readonly type: EditorTokenType
  readonly pattern: RegExp
}

/** Data contract that every language definition implements. */
export interface LanguageDefinition {
  /** Stable registry identifier, e.g. `'typescript'`. */
  readonly id: string
  /** Human readable name shown in the editor UI. */
  readonly label: string
  /** File extensions with a leading dot, used by auto detection. */
  readonly extensions: readonly string[]
  /** Token that opens a line comment, e.g. `//`. */
  readonly lineCommentToken?: string
  /** Open and close tokens of a block comment. */
  readonly blockCommentTokens?: readonly [string, string]
  /** Line-ending tokens that open one extra indent level after Enter. */
  readonly indentAfterTokens?: readonly string[]
  /** Indentation inserted per level; defaults to two spaces. */
  readonly indentUnit?: string
  /** Ordered classification rules; earlier rules win. */
  readonly rules: readonly EditorTokenRule[]
}
