import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, type JSX } from 'react'
import { describe, expect, it } from 'vitest'
import { Button } from '../button'
import { Dialog } from './Dialog'

function DialogHarness(): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete record"
        description="This action cannot be undone."
      >
        <p>Confirm deletion.</p>
      </Dialog>
    </>
  )
}

describe('Dialog', () => {
  it('opens, closes with Escape, and restores focus', async () => {
    const user = userEvent.setup()
    render(<DialogHarness />)

    const trigger = screen.getByRole('button', { name: 'Open' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Delete record' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes from its close button', async () => {
    const user = userEvent.setup()
    render(<DialogHarness />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
