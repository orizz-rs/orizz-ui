import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders title, description and actions', () => {
    render(<PageHeader title="Purchase orders" description="Review incoming orders" actions={<button type="button">New order</button>} />)
    expect(screen.getByRole('heading', { name: 'Purchase orders' })).toBeInTheDocument()
    expect(screen.getByText('Review incoming orders')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'New order' })).toBeInTheDocument()
  })
})
