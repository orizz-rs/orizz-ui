import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NumberInput } from './NumberInput'

describe('NumberInput', () => {
  it('reports a parsed value while preserving the native change event', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onValueChange = vi.fn()

    render(
      <NumberInput
        label="Quantity"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    )

    await user.type(screen.getByRole('spinbutton', { name: 'Quantity' }), '12')

    expect(onChange).toHaveBeenCalled()
    expect(onValueChange).toHaveBeenLastCalledWith(
      12,
      expect.objectContaining({ target: expect.anything() }),
    )
  })

  it('connects hint and error text to the input', () => {
    render(
      <NumberInput label="Quantity" hint="Whole units only" error="Invalid quantity" />,
    )

    const input = screen.getByRole('spinbutton', { name: 'Quantity' })
    const describedBy = input.getAttribute('aria-describedby')

    expect(describedBy).toBeTruthy()
    expect(screen.getByText('Invalid quantity')).toHaveAttribute('id', describedBy ?? '')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
