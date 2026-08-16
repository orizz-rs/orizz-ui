import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Radio } from './Radio'

describe('Radio', () => {
  it('selects an option', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Radio name="plan" value="starter" label="Starter" />
        <Radio name="plan" value="pro" label="Pro" />
      </div>,
    )

    const pro = screen.getByRole('radio', { name: 'Pro' })
    await user.click(pro)
    expect(pro).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Starter' })).not.toBeChecked()
  })
})
