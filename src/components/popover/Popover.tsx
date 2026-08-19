import {
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type JSX,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './Popover.module.css'

type PopoverTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>

export interface PopoverProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly trigger: ReactElement<PopoverTriggerProps>
  readonly title?: ReactNode
  readonly children: ReactNode
  readonly align?: 'start' | 'center' | 'end'
}

interface Position {
  readonly top: number
  readonly left: number
  readonly minWidth: number
}

function getPosition(
  anchor: HTMLElement,
  align: PopoverProps['align'],
): Position {
  const rect = anchor.getBoundingClientRect()
  const left =
    align === 'end'
      ? rect.right
      : align === 'center'
        ? rect.left + rect.width / 2
        : rect.left

  return { top: rect.bottom + 8, left, minWidth: rect.width }
}

export function Popover({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  align = 'start',
}: PopoverProps): JSX.Element {
  const titleId = useId()
  const anchorRef = useRef<HTMLSpanElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position | null>(null)

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setPosition(null)
      return undefined
    }

    const updatePosition = (): void => {
      if (anchorRef.current) setPosition(getPosition(anchorRef.current, align))
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [align, open])

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (anchorRef.current?.contains(target) || popoverRef.current?.contains(target)) {
        return
      }
      onOpenChange(false)
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onOpenChange, open])

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>): void => {
    trigger.props.onClick?.(event)
    if (!event.defaultPrevented) onOpenChange(!open)
  }

  const triggerWithState = cloneElement(trigger, {
    'aria-expanded': open,
    'aria-haspopup': 'dialog',
    onClick: handleTriggerClick,
  })

  return (
    <>
      <span ref={anchorRef} className={styles.anchor}>
        {triggerWithState}
      </span>
      {open && position && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={popoverRef}
              className={[styles.popover, styles[align]].join(' ')}
              role="dialog"
              aria-modal="false"
              aria-labelledby={title ? titleId : undefined}
              style={{
                top: position.top,
                left: position.left,
                minWidth: position.minWidth,
              }}
            >
              {title ? (
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
              ) : null}
              <div className={styles.content}>{children}</div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
