import type { CSSProperties, JSX } from 'react'
import styles from './CodeEditor.module.css'

interface EditorGutterProps {
  readonly lineCount: number
  readonly activeLine: number
  readonly scrollTop: number
}

export function EditorGutter({ lineCount, activeLine, scrollTop }: EditorGutterProps): JSX.Element {
  const lines = Array.from({ length: lineCount }, (_, index) => index + 1)
  const scrollStyle: CSSProperties = { transform: `translateY(${-scrollTop}px)` }

  return (
    <div className={styles.gutter} aria-hidden="true">
      <div className={styles.gutterLines} style={scrollStyle}>
        {lines.map((line) => (
          <div
            key={line}
            className={
              line === activeLine
                ? `${styles.gutterLine} ${styles.gutterLineActive}`
                : styles.gutterLine
            }
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
