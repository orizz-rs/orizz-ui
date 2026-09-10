import { useMemo, type CSSProperties, type JSX } from 'react'
import { tokenizeCode, type EditorTokenType, type LanguageDefinition } from './languages'
import { getTokenOffsets } from './CodeEditor.utils'
import styles from './CodeEditor.module.css'

const TOKEN_CLASS_NAMES: Record<EditorTokenType, string> = {
  comment: styles.tokenComment,
  string: styles.tokenString,
  number: styles.tokenNumber,
  keyword: styles.tokenKeyword,
  type: styles.tokenType,
  property: styles.tokenProperty,
  literal: styles.tokenLiteral,
  function: styles.tokenFunction,
  operator: styles.tokenOperator,
  punctuation: styles.tokenPunctuation,
  plain: styles.tokenPlain,
}

interface EditorHighlightProps {
  readonly value: string
  readonly language: LanguageDefinition
  readonly scroll: { readonly top: number; readonly left: number }
}

/**
 * The highlight layer rendered underneath the transparent textarea. It emits
 * the exact same characters as the textarea value, so both layers stay
 * aligned without per-line bookkeeping; scrolling is synced by translation.
 */
export function EditorHighlight({ value, language, scroll }: EditorHighlightProps): JSX.Element {
  const tokens = useMemo(() => tokenizeCode(value, language), [value, language])
  const offsets = useMemo(() => getTokenOffsets(tokens), [tokens])
  const scrollStyle: CSSProperties = {
    transform: `translate(${-scroll.left}px, ${-scroll.top}px)`,
  }

  const spans = tokens.map((token, index) => (
    <span key={`${token.type}-${offsets[index]}`} className={TOKEN_CLASS_NAMES[token.type]}>
      {token.text}
    </span>
  ))

  return (
    <pre className={styles.highlight} style={scrollStyle} aria-hidden="true">
      <code>{spans}</code>
    </pre>
  )
}
