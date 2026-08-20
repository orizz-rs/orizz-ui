import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { QuantityInput } from './QuantityInput'

describe('QuantityInput', () => {
  it('adds the provided unit to a numeric input', () => {
    render(<QuantityInput label="Weight" unit="kg" defaultValue={12.5} />)
    expect(screen.getByRole('spinbutton', { name: 'Weight' })).toHaveValue(12.5)
    expect(screen.getByText('kg')).toBeInTheDocument()
  })
})
