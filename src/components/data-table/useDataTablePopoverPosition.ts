import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import type { DataTableAlign } from './DataTable.types'

interface PopoverCoordinates {
  readonly top: number
  readonly left: number
}

interface PopoverPositionResult {
  readonly positionStyle: CSSProperties | undefined
}

function getRemSize(): number {
  const value = Number.parseFloat(
    window.getComputedStyle(document.documentElement).fontSize,
  )
  return Number.isFinite(value) ? value : 16
}

export function useDataTablePopoverPosition(
  isOpen: boolean,
  align: DataTableAlign,
  anchorRef: RefObject<HTMLButtonElement | null>,
  popoverRef: RefObject<HTMLDivElement | null>,
): PopoverPositionResult {
  const [coordinates, setCoordinates] = useState<PopoverCoordinates | null>(null)

  useLayoutEffect(() => {
    if (!isOpen) return undefined
    const updatePosition = (): void => {
      const anchor = anchorRef.current
      const popover = popoverRef.current
      if (!anchor || !popover) return
      const anchorRect = anchor.getBoundingClientRect()
      const popoverRect = popover.getBoundingClientRect()
      const rem = getRemSize()
      const gap = rem * 0.25
      const viewportPadding = rem
      const preferredLeft = align === 'end'
        ? anchorRect.right - popoverRect.width
        : anchorRect.left
      const maximumLeft = window.innerWidth - popoverRect.width - viewportPadding
      const left = Math.min(
        Math.max(preferredLeft, viewportPadding),
        Math.max(viewportPadding, maximumLeft),
      )
      const below = anchorRect.bottom + gap
      const above = anchorRect.top - popoverRect.height - gap
      const top = below + popoverRect.height <= window.innerHeight - viewportPadding
        ? below
        : Math.max(viewportPadding, above)
      setCoordinates((current) => (
        current?.top === top && current.left === left ? current : { top, left }
      ))
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [align, anchorRef, isOpen, popoverRef])

  return {
    positionStyle: coordinates
      ? { top: coordinates.top, left: coordinates.left }
      : undefined,
  }
}
