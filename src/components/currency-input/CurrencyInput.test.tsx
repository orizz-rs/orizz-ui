import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CurrencyInput } from './CurrencyInput'

describe('CurrencyInput', () => {
  it('renders the currency adornment and decimal number input', () => {
    render(<CurrencyInput label="Unit price" currency="THB" />)

    expect(screen.getByText('THB')).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Unit price' })).toHaveAttribute(
      'inputmode',
      'decimal',
    )
  })
})
