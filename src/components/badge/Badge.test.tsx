import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its content', () => {
    render(<Badge tone="success">Active</Badge>)

    expect(screen.getByText('Active')).toBeVisible()
  })
})
