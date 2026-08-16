import type { JSX } from 'react'

const colors = [
  {
    name: 'Background · 60%',
    token: '--orizz-color-background',
    className: 'background',
  },
  {
    name: 'Surface · 30%',
    token: '--orizz-color-surface',
    className: 'surface',
  },
  {
    name: 'Brand · 10%',
    token: '--orizz-color-brand',
    className: 'brand',
  },
] as const

export function RatioFoundation(): JSX.Element {
  return (
    <section className="section" aria-labelledby="ratio-title">
      <div className="section__heading">
        <div>
          <span className="eyebrow">Color foundation</span>
          <h2 id="ratio-title">60 / 30 / 10 balance</h2>
        </div>
        <p>
          Neutral space keeps the interface calm, surfaces build hierarchy,
          and green is reserved for attention and action.
        </p>
      </div>

      <div className="ratio-bar" aria-label="Color usage ratio">
        <span className="ratio-bar__background">60%</span>
        <span className="ratio-bar__surface">30%</span>
        <span className="ratio-bar__brand">10%</span>
      </div>

      <div className="token-grid">
        {colors.map((color) => (
          <article className="token" key={color.token}>
            <span className={`token__swatch token__swatch--${color.className}`} />
            <div>
              <strong>{color.name}</strong>
              <code>{color.token}</code>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
