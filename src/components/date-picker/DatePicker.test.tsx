import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('renders a date input with an accessible label', () => {
    render(<DatePicker label="Due date" />)
    expect(screen.getByLabelText('Due date')).toHaveAttribute('type', 'date')
  })

  it('reports a date value change', () => {
    const onChange = vi.fn()
    render(<DatePicker label="Due date" onChange={onChange} />)
    const input = screen.getByLabelText('Due date')
    fireEvent.change(input, { target: { value: '2026-08-20' } })
    expect(input).toHaveValue('2026-08-20')
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('announces an error', () => {
    render(<DatePicker label="Due date" error="Choose a due date." />)
    expect(screen.getByLabelText('Due date')).toBeInvalid()
    expect(screen.getByText('Choose a due date.')).toBeInTheDocument()
  })
})
