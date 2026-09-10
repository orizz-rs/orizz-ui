import type { JSX } from 'react'
import type { EditorCaretPosition } from './CodeEditor.utils'
import styles from './CodeEditor.module.css'

interface EditorStatusBarProps {
  readonly caret: EditorCaretPosition
  readonly lineCount: number
  readonly languageLabel: string
  readonly readOnly: boolean
}

export function EditorStatusBar({
  caret,
  lineCount,
  languageLabel,
  readOnly,
}: EditorStatusBarProps): JSX.Element {
  return (
    <div className={styles.statusBar}>
      <span className={styles.statusItem}>
        Ln {caret.line}, Col {caret.column}
      </span>
      <span className={styles.statusItem}>
        {lineCount} {lineCount === 1 ? 'line' : 'lines'}
      </span>
      <span className={styles.statusSpacer} />
      {readOnly ? <span className={styles.statusBadge}>Read-only</span> : null}
      <span className={styles.statusItem}>{languageLabel}</span>
    </div>
  )
}
