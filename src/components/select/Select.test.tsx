import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'

describe('Select', () => {
  it('selects an option', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Select label="Role" onChange={handleChange} defaultValue="member">
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </Select>,
    )

    await user.selectOptions(screen.getByRole('combobox', { name: 'Role' }), 'admin')
    expect(handleChange).toHaveBeenCalledOnce()
  })

  it('announces an error', () => {
    render(
      <Select label="Role" error="Select a role">
        <option value="member">Member</option>
      </Select>,
    )

    expect(screen.getByRole('combobox', { name: 'Role' })).toBeInvalid()
  })
})
