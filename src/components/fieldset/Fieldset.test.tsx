import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Fieldset } from './Fieldset'

describe('Fieldset', () => {
  it('groups fields under a legend', () => {
    render(<Fieldset legend="Notifications"><input aria-label="Email" /></Fieldset>)
    expect(screen.getByRole('group', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('disables descendants through native fieldset semantics', () => {
    render(<Fieldset legend="Notifications" disabled><input aria-label="Email" /></Fieldset>)
    expect(screen.getByLabelText('Email')).toBeDisabled()
  })
})
