import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Toast } from './Toast'

describe('Toast', () => {
  it('renders a dismissible status message', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Toast open title="Saved" onDismiss={onDismiss}>Purchase order saved.</Toast>)

    expect(screen.getByRole('status')).toHaveTextContent('Purchase order saved.')
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
