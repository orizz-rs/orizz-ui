import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders a title and description', () => {
    render(<Alert title="Saved">Your changes are now live.</Alert>)

    expect(screen.getByText('Saved')).toBeVisible()
    expect(screen.getByText('Your changes are now live.')).toBeVisible()
  })

  it('calls its dismiss handler', async () => {
    const user = userEvent.setup()
    const handleDismiss = vi.fn()
    render(<Alert title="Update" onDismiss={handleDismiss} />)

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(handleDismiss).toHaveBeenCalledOnce()
  })
})
