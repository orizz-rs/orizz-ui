import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SplitPane } from './SplitPane'

describe('SplitPane', () => {
  it('renders both panes and orientation', () => {
    const { container } = render(<SplitPane orientation="vertical" first={<span>List</span>} second={<span>Details</span>} />)
    expect(screen.getByText('List')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('data-orientation', 'vertical')
  })
})
