import {
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type JSX,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import styles from './Dialog.module.css'

export interface DialogProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly title: ReactNode
  readonly description?: ReactNode
  readonly closeLabel?: string
  readonly children: ReactNode
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  closeLabel = 'Close dialog',
  children,
  className,
  ...dialogProps
}: DialogProps): JSX.Element | null {
  const titleId = useId()
  const descriptionId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const classes = [styles.dialog, className].filter(Boolean).join(' ')

  useEffect(() => {
    if (!open) return undefined

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedRef.current?.focus()
    }
  }, [onOpenChange, open])

  if (!open || typeof document === 'undefined') return null

  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) onOpenChange(false)
  }

  return createPortal(
    <div className={styles.backdrop} onMouseDown={closeFromBackdrop}>
      <div
        {...dialogProps}
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.close}
            aria-label={closeLabel}
            onClick={() => onOpenChange(false)}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
