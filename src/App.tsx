import { useState, type JSX } from 'react'
import { Badge, Button } from './index'
import { ComponentShowcase } from './playground/ComponentShowcase'
import { DataTableShowcase } from './playground/DataTableShowcase'
import { ErpComponentShowcase } from './playground/ErpComponentShowcase'
import { FoundationCatalog } from './playground/FoundationCatalog'
import { RatioFoundation } from './playground/RatioFoundation'
import { ThemeIcon } from './playground/ThemeIcon'
import './App.css'

type ThemeName = 'light' | 'dark'

function App(): JSX.Element {
  const [theme, setTheme] = useState<ThemeName>('light')

  const toggleTheme = (): void => {
    setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light',
    )
  }

  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <div className="design-system" data-theme={theme}>
      <nav className="topbar" aria-label="Design system navigation">
        <a className="brand-lockup" href="#top" aria-label="Orizz home">
          <span className="brand-mark">O</span>
          <span>Orizz UI</span>
        </a>
        <div className="topbar__actions">
          <Badge tone="success">Light + Dark</Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} theme`}
          >
            <span className="theme-icon">
              <ThemeIcon theme={theme} />
            </span>
            {theme === 'light' ? 'Light' : 'Dark'}
          </Button>
        </div>
      </nav>

      <main id="top" className="playground">
        <header className="hero">
          <div className="hero__content">
            <Badge tone="brand">Design system · 01</Badge>
            <h1>
              Green by purpose,
              <br />
              clear by design.
            </h1>
            <p>
              A calm, accessible foundation for Orizz products—balanced with
              the 60/30/10 color rule and ready for light and dark experiences.
            </p>
            <div className="hero__actions">
              <Button size="lg">Explore components</Button>
              <Button size="lg" variant="ghost">
                View tokens →
              </Button>
            </div>
          </div>

          <aside className="principle-card" aria-label="Design principles">
            <span className="principle-card__number">60—30—10</span>
            <h2>
              One system.
              <br />
              Two themes.
            </h2>
            <p>Every decision maps back to a shared semantic token.</p>
            <div className="principle-card__footer">
              <span>Primary</span>
              <strong>Emerald green</strong>
            </div>
          </aside>
        </header>

        <RatioFoundation />
        <ComponentShowcase />
        <FoundationCatalog />
        <ErpComponentShowcase />
        <DataTableShowcase />
      </main>

      <footer className="footer">
        <span>Orizz Design System</span>
        <span>Accessible · Themeable · Package-ready</span>
      </footer>
    </div>
  )
}

export default App
