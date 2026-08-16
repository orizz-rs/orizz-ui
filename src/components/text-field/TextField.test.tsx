import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextField } from './TextField'

describe('TextField', () => {
  it('connects the label and hint to the input', () => {
    render(<TextField label="Email" hint="Use your work email" />)

    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input).toHaveAccessibleDescription('Use your work email')
  })

  it('announces an invalid state', () => {
    render(<TextField label="Email" error="Email is required" />)

    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('Email is required')
  })
})
