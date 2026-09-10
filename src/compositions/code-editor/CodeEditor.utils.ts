import type { EditorToken, LanguageDefinition } from './languages'

/** Pure helpers shared by the editor UI files. No React, no DOM. */

export interface EditorCaretPosition {
  readonly line: number
  readonly column: number
}

/** Start offset of every token in `tokens`, aligned by index. */
export function getTokenOffsets(tokens: readonly EditorToken[]): readonly number[] {
  const offsets: number[] = []
  let position = 0
  for (const token of tokens) {
    offsets.push(position)
    position += token.text.length
  }
  return offsets
}

export function countLines(value: string): number {
  return value.split('\n').length
}

export function getCaretPosition(value: string, caretIndex: number): EditorCaretPosition {
  const safeIndex = Math.max(0, Math.min(caretIndex, value.length))
  const beforeCaret = value.slice(0, safeIndex)
  const lastNewLine = beforeCaret.lastIndexOf('\n')
  return {
    line: beforeCaret.split('\n').length,
    column: beforeCaret.length - lastNewLine,
  }
}

function getLineStartIndex(value: string, caretIndex: number): number {
  if (caretIndex <= 0) {
    return 0
  }
  return value.lastIndexOf('\n', caretIndex - 1) + 1
}

/**
 * Indentation to insert after pressing Enter at `caretIndex`: the leading
 * whitespace of the current line, plus one level when the line opens a block
 * token declared by the language.
 */
export function getEnterIndent(
  value: string,
  caretIndex: number,
  language: LanguageDefinition,
): string {
  const lineStart = getLineStartIndex(value, caretIndex)
  const linePrefix = value.slice(lineStart, caretIndex)
  const leadingMatch = /^[ \t]*/.exec(linePrefix)
  const leading = leadingMatch !== null ? leadingMatch[0] : ''
  const trimmedLine = linePrefix.trimEnd()
  const opensBlock =
    language.indentAfterTokens?.some((token) => trimmedLine.endsWith(token)) ?? false
  const indentUnit = language.indentUnit ?? '  '
  return opensBlock ? leading + indentUnit : leading
}
