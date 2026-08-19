import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, type JSX } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Combobox, type ComboboxOption } from './Combobox'

const options: readonly ComboboxOption[] = [
  { value: 'warehouse-bkk', label: 'Bangkok warehouse' },
  { value: 'warehouse-cnx', label: 'Chiang Mai warehouse' },
]

describe('Combobox', () => {
  it('filters options and selects with the keyboard', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Combobox label="Warehouse" options={options} onValueChange={onValueChange} />,
    )

    const input = screen.getByRole('combobox', { name: 'Warehouse' })
    await user.type(input, 'Chiang')
    expect(screen.getByRole('option', { name: 'Chiang Mai warehouse' })).toBeInTheDocument()
    await user.keyboard('{ArrowDown}{Enter}')

    expect(onValueChange).toHaveBeenCalledWith('warehouse-cnx')
    expect(input).toHaveValue('Chiang Mai warehouse')
  })

  it('supports controlled values', async () => {
    const user = userEvent.setup()
    function Harness(): JSX.Element {
      const [value, setValue] = useState('warehouse-bkk')
      return (
        <Combobox
          label="Warehouse"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      )
    }

    render(<Harness />)
    const input = screen.getByRole('combobox', { name: 'Warehouse' })
    expect(input).toHaveValue('Bangkok warehouse')
    await user.click(input)
    await user.clear(input)
    await user.click(screen.getByRole('option', { name: 'Chiang Mai warehouse' }))
    expect(input).toHaveValue('Chiang Mai warehouse')
  })
})
