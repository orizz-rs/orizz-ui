import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('renders groups and marks active items', () => {
    render(<Sidebar groups={[{ id: 'main', label: 'Workspace', items: [{ id: 'home', label: 'Home', href: '/home', active: true }] }]} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Workspace')).toBeInTheDocument()
  })

  it('notifies when a button item is selected', async () => {
    const onItemSelect = vi.fn()
    render(<Sidebar onItemSelect={onItemSelect} groups={[{ id: 'main', items: [{ id: 'settings', label: 'Settings' }] }]} />)
    screen.getByRole('button', { name: 'Settings' }).click()
    expect(onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'settings' }))
  })
})
