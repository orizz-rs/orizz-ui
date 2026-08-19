import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, type JSX } from 'react'
import { describe, expect, it } from 'vitest'
import { Button } from '../button'
import { Popover } from './Popover'

function renderPopover(): void {
  render(
    <Popover
      open={false}
      onOpenChange={() => undefined}
      trigger={<Button>Filters</Button>}
      title="Filter status"
    >
      <p>Filter content</p>
    </Popover>,
  )
}

describe('Popover', () => {
  it('adds trigger state attributes', () => {
    renderPopover()
    const trigger = screen.getByRole('button', { name: 'Filters' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
  })

  it('toggles from the trigger and closes with Escape', async () => {
    const user = userEvent.setup()
    function Harness(): JSX.Element {
      const [open, setOpen] = useState(false)

      return (
        <Popover
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>Filters</Button>}
          title="Filter status"
        >
          <p>Filter content</p>
        </Popover>
      )
    }

    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Filters' }))
    expect(screen.getByRole('dialog', { name: 'Filter status' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
