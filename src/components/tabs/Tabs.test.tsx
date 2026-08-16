import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs, type TabItem } from './Tabs'

const items: readonly TabItem[] = [
  { id: 'overview', label: 'Overview', content: 'Overview content' },
  { id: 'members', label: 'Members', content: 'Members content' },
  { id: 'billing', label: 'Billing', content: 'Billing content', disabled: true },
]

describe('Tabs', () => {
  it('changes the active panel when a tab is selected', async () => {
    const user = userEvent.setup()
    render(<Tabs items={items} />)

    await user.click(screen.getByRole('tab', { name: 'Members' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Members content')
  })

  it('supports arrow-key navigation and skips disabled tabs', async () => {
    const user = userEvent.setup()
    render(<Tabs items={items} defaultValue="members" />)

    const membersTab = screen.getByRole('tab', { name: 'Members' })
    membersTab.focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview content')
  })
})
