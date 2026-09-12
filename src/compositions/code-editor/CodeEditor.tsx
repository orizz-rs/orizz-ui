import {
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import { Toolbar } from '../../components/toolbar'
import styles from './CodeEditor.module.css'
import { EditorGutter } from './EditorGutter'
import { EditorHighlight } from './EditorHighlight'
import { EditorStatusBar } from './EditorStatusBar'
import { useCodeEditor } from './useCodeEditor'
import {
  detectLanguage,
  getLanguage,
  listLanguages,
  plainTextLanguage,
  type LanguageDefinition,
} from './languages'

export interface CodeEditorProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the text area; also shown as the editor title. */
  readonly label: string
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  /** Registry language id, or a custom `LanguageDefinition`. */
  readonly language?: string | LanguageDefinition
  /** Shows the language picker and reports the chosen registry id. */
  readonly onLanguageChange?: (languageId: string) => void
  /** File name shown in the toolbar; auto-detects the language when `language` is omitted. */
  readonly fileName?: string
  readonly readOnly?: boolean
  readonly showLineNumbers?: boolean
  /** Fixed editor height; the editor keeps a minimum height without it. */
  readonly height?: number | string
  /** Extra actions rendered at the end of the toolbar (e.g. a Run button). */
  readonly actions?: ReactNode
}

function resolveLanguage(
  language: string | LanguageDefinition | undefined,
  fileName: string | undefined,
): LanguageDefinition {
  if (typeof language === 'string') {
    return getLanguage(language) ?? plainTextLanguage
  }
  if (language !== undefined) {
    return language
  }
  if (fileName !== undefined) {
    return detectLanguage(fileName) ?? plainTextLanguage
  }
  return plainTextLanguage
}

export function CodeEditor({
  label,
  value,
  defaultValue,
  onValueChange,
  language,
  onLanguageChange,
  fileName,
  readOnly = false,
  showLineNumbers = true,
  height,
  actions,
  className,
  style,
  ...divProps
}: CodeEditorProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | undefined>(undefined)
  const resolvedLanguage = resolveLanguage(language, fileName)
  const activeLanguage =
    language === undefined && selectedLanguageId !== undefined
      ? (getLanguage(selectedLanguageId) ?? resolvedLanguage)
      : resolvedLanguage

  const editor = useCodeEditor({
    value,
    defaultValue,
    onValueChange,
    language: activeLanguage,
    readOnly,
    textareaRef,
  })

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const languageId = event.target.value
    if (language === undefined) {
      setSelectedLanguageId(languageId)
    }
    onLanguageChange?.(languageId)
  }

  const editorStyle = height !== undefined ? { ...style, height } : style

  return (
    <div
      {...divProps}
      className={[styles.editor, className].filter(Boolean).join(' ')}
      style={editorStyle}
    >
      <Toolbar
        className={styles.toolbar}
        start={
          <span className={styles.title}>
            {label}
            {fileName !== undefined ? <span className={styles.fileName}>{fileName}</span> : null}
          </span>
        }
        end={
          actions !== undefined || onLanguageChange !== undefined ? (
            <span className={styles.toolbarEnd}>
              {actions}
              {onLanguageChange !== undefined ? (
                <select
                  className={styles.languageSelect}
                  aria-label="Language"
                  value={activeLanguage.id}
                  onChange={handleLanguageChange}
                >
                  {listLanguages().map((definition) => (
                    <option key={definition.id} value={definition.id}>
                      {definition.label}
                    </option>
                  ))}
                </select>
              ) : undefined}
            </span>
          ) : undefined
        }
      />
      <div className={styles.body}>
        {showLineNumbers ? (
          <EditorGutter
            lineCount={editor.lineCount}
            activeLine={editor.caret.line}
            scrollTop={editor.scroll.top}
          />
        ) : null}
        <div className={styles.surface}>
          <EditorHighlight value={editor.value} language={activeLanguage} scroll={editor.scroll} />
          <textarea
            ref={textareaRef}
            className={styles.input}
            value={editor.value}
            onChange={editor.handleChange}
            onKeyDown={editor.handleKeyDown}
            onSelect={editor.handleSelect}
            onScroll={editor.handleScroll}
            spellCheck={false}
            wrap="off"
            readOnly={readOnly}
            aria-label={label}
          />
        </div>
      </div>
      <EditorStatusBar
        caret={editor.caret}
        lineCount={editor.lineCount}
        languageLabel={activeLanguage.label}
        readOnly={readOnly}
      />
    </div>
  )
}
