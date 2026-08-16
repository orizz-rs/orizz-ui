import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('connects its label and hint', () => {
    render(<Textarea label="Notes" hint="Maximum 500 characters" />)

    const textarea = screen.getByRole('textbox', { name: 'Notes' })
    expect(textarea).toHaveAccessibleDescription('Maximum 500 characters')
  })

  it('announces an error', () => {
    render(<Textarea label="Notes" error="Notes are required" />)

    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInvalid()
  })
})
