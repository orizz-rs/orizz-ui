import {
  useCallback,
  useState,
  type HTMLAttributes,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Play, Square } from 'lucide-react'
import { Button } from '../../components/button'
import { CodeEditor } from '../code-editor'
import { splitStatements } from './splitStatements'
import styles from './QueryEditor.module.css'

export interface QueryEditorProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible editor label passed through to the underlying CodeEditor. */
  readonly label?: string
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  /** Set by the caller while a query is executing; shows Cancel instead of Run. */
  readonly isRunning?: boolean
  /** Called with the runnable SQL when Run / Ctrl+Enter is pressed. */
  readonly onRun?: (sql: string) => void
  readonly onCancel?: () => void
  /** Called every time the executed query history changes (most recent first). */
  readonly onHistoryChange?: (history: readonly string[]) => void
  readonly maxHistory?: number
  readonly height?: number | string
  readonly readOnly?: boolean
}

/**
 * SQL query editor built on `CodeEditor`. It owns the Run / Cancel workflow,
 * splits the buffer into statements through the pure `splitStatements` util,
 * and reports runnable SQL and query history to the caller without knowing
 * anything about a backend.
 */
export function QueryEditor({
  label = 'Query',
  value,
  defaultValue = '',
  onValueChange,
  isRunning = false,
  onRun,
  onCancel,
  onHistoryChange,
  maxHistory = 20,
  height,
  readOnly = false,
  className,
  ...divProps
}: QueryEditorProps): JSX.Element {
  const [mirrorValue, setMirrorValue] = useState(defaultValue)
  const [history, setHistory] = useState<readonly string[]>([])
  const effectiveValue = value ?? mirrorValue

  const handleValueChange = useCallback(
    (next: string): void => {
      if (value === undefined) setMirrorValue(next)
      onValueChange?.(next)
    },
    [onValueChange, value],
  )

  const runQuery = useCallback((): void => {
    if (isRunning) return
    const statements = splitStatements(effectiveValue)
    if (statements.length === 0) return
    onRun?.(statements.join(';\n'))
    const nextHistory = [effectiveValue, ...history].slice(0, maxHistory)
    setHistory(nextHistory)
    onHistoryChange?.(nextHistory)
  }, [effectiveValue, history, isRunning, maxHistory, onHistoryChange, onRun])

  const handleContainerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        runQuery()
      }
    },
    [runQuery],
  )

  const actions: ReactNode = (
    <span className={styles.actions}>
      {isRunning ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          aria-label="Cancel running query"
        >
          <Square size={14} aria-hidden="true" />
          Cancel
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          onClick={runQuery}
          aria-label="Run query"
        >
          <Play size={14} aria-hidden="true" />
          Run
        </Button>
      )}
      <span className={styles.hint}>Ctrl+Enter to run</span>
    </span>
  )

  return (
    <div
      {...divProps}
      className={[styles.queryEditor, className].filter(Boolean).join(' ')}
      onKeyDown={handleContainerKeyDown}
    >
      <CodeEditor
        label={label}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        language="sql"
        readOnly={readOnly}
        height={height}
        actions={actions}
      />
    </div>
  )
}