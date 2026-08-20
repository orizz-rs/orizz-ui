import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PercentageInput } from './PercentageInput'

describe('PercentageInput', () => {
  it('adds a percentage suffix to a numeric input', () => {
    render(<PercentageInput label="Tax rate" defaultValue={7} />)
    expect(screen.getByRole('spinbutton', { name: 'Tax rate' })).toHaveValue(7)
    expect(screen.getByText('%')).toBeInTheDocument()
  })
})
