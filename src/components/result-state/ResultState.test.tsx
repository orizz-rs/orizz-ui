import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResultState } from './ResultState'

describe('ResultState', () => {
  it('renders a message and action', () => {
    render(<ResultState tone="danger" title="Unable to load" description="Try again later." action={<button type="button">Retry</button>} />)
    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'danger')
    expect(screen.getByRole('heading', { name: 'Unable to load' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })
})
