import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress } from './Progress'

describe('Progress', () => {
  it('renders a labelled progress value', () => {
    render(<Progress label="Approval progress" value={60} />)
    expect(screen.getByRole('progressbar', { name: 'Approval progress' })).toHaveValue(60)
    expect(screen.getByText('60%')).toBeInTheDocument()
  })
})
