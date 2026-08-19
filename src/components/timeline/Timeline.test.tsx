import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Timeline } from './Timeline'

describe('Timeline', () => {
  it('renders ordered activity items', () => {
    render(<Timeline items={[{ id: 'created', title: 'Order created', timestamp: '09:30' }, { id: 'approved', title: 'Approved', tone: 'success' }]} />)
    expect(screen.getByRole('list', { name: 'Activity timeline' })).toBeInTheDocument()
    expect(screen.getByText('Order created')).toBeInTheDocument()
    expect(screen.getByText('09:30')).toBeInTheDocument()
  })
})
