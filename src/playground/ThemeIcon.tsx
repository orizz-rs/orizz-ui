import { Moon, Sun } from 'lucide-react'
import type { JSX } from 'react'

interface ThemeIconProps {
  readonly theme: 'light' | 'dark'
}

export function ThemeIcon({ theme }: ThemeIconProps): JSX.Element {
  if (theme === 'light') {
    return <Sun aria-hidden="true" />
  }

  return <Moon aria-hidden="true" />
}
