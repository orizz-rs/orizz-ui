import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toolbar } from './Toolbar'

describe('Toolbar', () => {
  it('renders start and end content', () => {
    render(<Toolbar start={<span>Filters</span>} end={<button type="button">Export</button>} />)
    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument()
  })
})
