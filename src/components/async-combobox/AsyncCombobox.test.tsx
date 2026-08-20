import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AsyncCombobox } from './AsyncCombobox'

describe('AsyncCombobox', () => {
  it('loads options when focused and selects one', async () => {
    const user = userEvent.setup()
    const loadOptions = vi.fn(async () => [{ value: 'acme', label: 'Acme Co.' }])
    const onValueChange = vi.fn()
    render(<AsyncCombobox label="Customer" loadOptions={loadOptions} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('combobox', { name: 'Customer' }))
    const option = await screen.findByRole('option', { name: 'Acme Co.' })
    await user.click(option)
    expect(onValueChange).toHaveBeenCalledWith('acme')
  })

  it('renders a load error', async () => {
    const user = userEvent.setup()
    render(<AsyncCombobox label="Customer" loadOptions={async () => Promise.reject(new Error('Network'))} />)
    await user.click(screen.getByRole('combobox', { name: 'Customer' }))
    expect(await screen.findByText('Unable to load options. Try again.')).toBeInTheDocument()
  })
})
