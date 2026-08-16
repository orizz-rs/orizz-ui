import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Switch } from './Switch'

describe('Switch', () => {
  it('toggles its checked state', async () => {
    const user = userEvent.setup()
    render(<Switch label="Dark mode" />)

    const control = screen.getByRole('switch', { name: 'Dark mode' })
    await user.click(control)
    expect(control).toBeChecked()
  })

  it('can be disabled', () => {
    render(<Switch label="Dark mode" disabled />)
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeDisabled()
  })
})
