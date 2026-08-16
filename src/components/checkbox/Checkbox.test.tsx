import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('toggles when its label is clicked', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Email notifications" />)

    const checkbox = screen.getByRole('checkbox', { name: 'Email notifications' })
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('connects its description', () => {
    render(
      <Checkbox
        label="Email notifications"
        description="Receive a weekly summary"
      />,
    )

    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).toHaveAccessibleDescription('Receive a weekly summary')
  })
})
