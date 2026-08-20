import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TimeInput } from './TimeInput'

describe('TimeInput', () => {
  it('renders a labelled native time input', () => {
    render(<TimeInput label="Delivery time" />)
    expect(screen.getByLabelText('Delivery time')).toHaveAttribute('type', 'time')
  })

  it('reports time changes', () => {
    const onChange = vi.fn()
    render(<TimeInput label="Delivery time" onChange={onChange} />)
    const input = screen.getByLabelText('Delivery time')
    fireEvent.change(input, { target: { value: '09:30' } })
    expect(input).toHaveValue('09:30')
    expect(onChange).toHaveBeenCalledOnce()
  })
})
