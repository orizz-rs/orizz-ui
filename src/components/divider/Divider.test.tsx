import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders an accessible separator', () => {
    render(<Divider aria-label="Account settings" />)
    expect(screen.getByRole('separator', { name: 'Account settings' })).toBeVisible()
  })

  it('can be decorative', () => {
    render(<Divider decorative />)
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
  })
})
