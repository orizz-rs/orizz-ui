import type { JSX } from 'react'
import { Badge, Button, TextField } from '../index'

const buttonVariants = ['primary', 'secondary', 'ghost', 'danger'] as const

export function ComponentShowcase(): JSX.Element {
  return (
    <section className="section" aria-labelledby="components-title">
      <div className="section__heading">
        <div>
          <span className="eyebrow">Core components</span>
          <h2 id="components-title">Built from semantic tokens</h2>
        </div>
        <Badge tone="brand">v0.1 foundation</Badge>
      </div>

      <div className="component-grid">
        <article className="showcase-card showcase-card--wide">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Action</span>
              <h3>Button</h3>
            </div>
            <code>4 variants</code>
          </header>
          <div className="component-row">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
          <div className="component-row">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button isLoading>Saving</Button>
          </div>
        </article>

        <article className="showcase-card">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Input</span>
              <h3>Text field</h3>
            </div>
          </header>
          <div className="field-stack">
            <TextField
              fullWidth
              label="Work email"
              placeholder="you@company.com"
              hint="Use your organization email."
            />
            <TextField
              fullWidth
              label="Project name"
              defaultValue="Orizz Design System"
              error="This project name already exists."
            />
          </div>
        </article>

        <article className="showcase-card">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Status</span>
              <h3>Badge</h3>
            </div>
          </header>
          <div className="badge-stack">
            <Badge tone="brand">New release</Badge>
            <Badge tone="neutral">Draft</Badge>
            <Badge tone="success">Healthy</Badge>
            <Badge tone="warning">Needs review</Badge>
            <Badge tone="danger">Blocked</Badge>
          </div>
        </article>
      </div>
    </section>
  )
}
