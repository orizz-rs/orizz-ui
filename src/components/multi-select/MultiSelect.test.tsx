import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MultiSelect } from './MultiSelect'

const options = [
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
]

describe('MultiSelect', () => {
  it('opens options from its labelled trigger', async () => {
    const user = userEvent.setup()
    render(<MultiSelect label="Teams" options={options} />)
    await user.click(screen.getByRole('button', { name: 'Teams' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('reports selected values', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<MultiSelect label="Teams" options={options} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('button', { name: 'Teams' }))
    await user.click(screen.getByRole('option', { name: 'Finance' }))
    expect(onValueChange).toHaveBeenCalledWith(['finance'])
    expect(screen.getByRole('button', { name: 'Teams' })).toHaveTextContent('Finance')
  })

  it('announces an error', () => {
    render(<MultiSelect label="Teams" options={options} error="Choose a team." />)
    expect(screen.getByRole('button', { name: 'Teams' })).toBeInvalid()
  })
})
