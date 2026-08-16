import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('provides an accessible status label', () => {
    render(<Spinner label="Saving changes" />)
    expect(screen.getByRole('status')).toHaveTextContent('Saving changes')
  })
})
