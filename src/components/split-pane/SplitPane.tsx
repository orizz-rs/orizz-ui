import type { CSSProperties, HTMLAttributes, JSX, ReactNode } from 'react'
import styles from './SplitPane.module.css'

export type SplitPaneOrientation = 'horizontal' | 'vertical'
export interface SplitPaneProps extends HTMLAttributes<HTMLDivElement> { readonly first: ReactNode; readonly second: ReactNode; readonly orientation?: SplitPaneOrientation; readonly firstSize?: string; readonly gap?: 'sm' | 'md' | 'lg' }

export function SplitPane({ first, second, orientation = 'horizontal', firstSize = '50%', gap = 'md', className, style, ...divProps }: SplitPaneProps): JSX.Element {
  const paneStyle: CSSProperties & { readonly '--orizz-split-first': string } = { ...style, '--orizz-split-first': firstSize }
  return <div {...divProps} className={[styles.splitPane, styles[orientation], styles[gap], className].filter(Boolean).join(' ')} data-orientation={orientation} style={paneStyle}><div className={styles.pane}>{first}</div><div className={styles.divider} aria-hidden="true" /><div className={styles.pane}>{second}</div></div>
}
