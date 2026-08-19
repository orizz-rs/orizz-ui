import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Accordion } from './Accordion'

describe('Accordion', () => {
  it('opens and closes an item', async () => {
    const user = userEvent.setup()
    render(<Accordion items={[{ id: 'details', title: 'Details', content: 'Order details' }]} />)
    const trigger = screen.getByRole('button', { name: 'Details' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Order details')).toBeVisible()
  })
})
