import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NavigationMenu } from './NavigationMenu'

describe('NavigationMenu', () => {
  it('marks the active item', () => {
    render(<NavigationMenu items={[{ id: 'dashboard', label: 'Dashboard', active: true }, { id: 'orders', label: 'Orders' }]} />)
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
  })

  it('emits item selection', () => {
    const onItemSelect = vi.fn()
    render(<NavigationMenu onItemSelect={onItemSelect} items={[{ id: 'orders', label: 'Orders' }]} />)
    screen.getByRole('button', { name: 'Orders' }).click()
    expect(onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'orders' }))
  })
})
