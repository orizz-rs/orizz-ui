import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('exposes a loading status label', () => {
    render(<Skeleton variant="rect" label="Loading purchase order" />)
    expect(screen.getByRole('status', { name: 'Loading purchase order' })).toBeInTheDocument()
  })
})
