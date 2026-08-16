import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders an accessible fallback', () => {
    render(<Avatar alt="Kong Suwan" fallback="KS" />)
    expect(screen.getByRole('img', { name: 'Kong Suwan' })).toHaveTextContent('KS')
  })

  it('renders an image when a source is provided', () => {
    render(<Avatar src="/avatar.png" alt="Kong Suwan" fallback="KS" />)
    expect(screen.getByRole('img', { name: 'Kong Suwan' })).toHaveAttribute(
      'src',
      '/avatar.png',
    )
  })
})
