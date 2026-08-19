import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders descriptive content and an action', () => {
    render(<EmptyState title="No purchase orders" description="Create your first order." action={<button type="button">Create order</button>} />)
    expect(screen.getByRole('heading', { name: 'No purchase orders' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create order' })).toBeInTheDocument()
  })
})
