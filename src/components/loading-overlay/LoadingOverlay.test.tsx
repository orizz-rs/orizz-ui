import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoadingOverlay } from './LoadingOverlay'

describe('LoadingOverlay', () => {
  it('shows and hides the loading layer', () => {
    const { rerender } = render(<LoadingOverlay>Content</LoadingOverlay>)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    rerender(<LoadingOverlay open={false}>Content</LoadingOverlay>)
    expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument()
  })
})
