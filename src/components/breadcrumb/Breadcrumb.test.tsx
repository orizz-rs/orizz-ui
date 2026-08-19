import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Breadcrumb } from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders links and marks the current location', () => {
    render(
      <Breadcrumb
        items={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'orders', label: 'Orders', href: '/orders' },
          { id: 'detail', label: 'PO-1001' },
        ]}
      />,
    )

    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('href', '/orders')
    expect(screen.getByText('PO-1001')).toHaveAttribute('aria-current', 'page')
  })
})
