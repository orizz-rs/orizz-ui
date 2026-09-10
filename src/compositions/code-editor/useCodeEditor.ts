import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type RefObject,
  type SyntheticEvent,
} from 'react'
import type { LanguageDefinition } from './languages'
import { countLines, getCaretPosition, getEnterIndent, type EditorCaretPosition } from './CodeEditor.utils'

export interface UseCodeEditorParams {
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  readonly language: LanguageDefinition
  readonly readOnly: boolean
  readonly textareaRef: RefObject<HTMLTextAreaElement | null>
}

export interface UseCodeEditorResult {
  readonly value: string
  readonly caret: EditorCaretPosition
  readonly lineCount: number
  readonly scroll: { readonly top: number; readonly left: number }
  readonly handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  readonly handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  readonly handleSelect: (event: SyntheticEvent<HTMLTextAreaElement>) => void
  readonly handleScroll: (event: SyntheticEvent<HTMLTextAreaElement>) => void
}

/**
 * Owns the editor's value, caret tracking, scroll sync and keyboard editing
 * (Tab indent, Enter auto-indent) so CodeEditor stays a thin view layer.
 */
export function useCodeEditor(params: UseCodeEditorParams): UseCodeEditorResult {
  const { value: controlledValue, defaultValue = '', onValueChange, language, readOnly, textareaRef } = params
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = controlledValue ?? internalValue
  const [caretIndex, setCaretIndex] = useState(0)
  const [scroll, setScroll] = useState({ top: 0, left: 0 })
  const pendingCaretRef = useRef<number | undefined>(undefined)

  useLayoutEffect(() => {
    const pendingCaret = pendingCaretRef.current
    if (pendingCaret === undefined) {
      return
    }
    pendingCaretRef.current = undefined
    textareaRef.current?.setSelectionRange(pendingCaret, pendingCaret)
  })

  const applyEdit = useCallback(
    (nextValue: string, nextCaret: number) => {
      pendingCaretRef.current = nextCaret
      setCaretIndex(nextCaret)
      if (controlledValue === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    },
    [controlledValue, onValueChange],
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.target.value
      if (controlledValue === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
      setCaretIndex(event.target.selectionStart)
    },
    [controlledValue, onValueChange],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (readOnly) {
        return
      }
      const { selectionStart, selectionEnd } = event.currentTarget
      const indentUnit = language.indentUnit ?? '  '

      if (event.key === 'Tab') {
        event.preventDefault()
        applyEdit(
          value.slice(0, selectionStart) + indentUnit + value.slice(selectionEnd),
          selectionStart + indentUnit.length,
        )
        return
      }

      if (event.key === 'Enter' && selectionStart === selectionEnd) {
        event.preventDefault()
        const indent = getEnterIndent(value, selectionStart, language)
        applyEdit(
          `${value.slice(0, selectionStart)}\n${indent}${value.slice(selectionEnd)}`,
          selectionStart + 1 + indent.length,
        )
      }
    },
    [applyEdit, language, readOnly, value],
  )

  const handleSelect = useCallback((event: SyntheticEvent<HTMLTextAreaElement>) => {
    setCaretIndex(event.currentTarget.selectionStart)
  }, [])

  const handleScroll = useCallback((event: SyntheticEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = event.currentTarget
    setScroll((previous) =>
      previous.top === scrollTop && previous.left === scrollLeft
        ? previous
        : { top: scrollTop, left: scrollLeft },
    )
  }, [])

  return {
    value,
    caret: getCaretPosition(value, caretIndex),
    lineCount: countLines(value),
    scroll,
    handleChange,
    handleKeyDown,
    handleSelect,
    handleScroll,
  }
}
