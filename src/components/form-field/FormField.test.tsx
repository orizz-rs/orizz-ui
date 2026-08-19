import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormField } from './FormField'

describe('FormField', () => {
  it('associates its label with the provided control id', () => {
    render(
      <FormField label="Department" htmlFor="department-id">
        <select id="department-id" aria-label="Department control" />
      </FormField>,
    )

    expect(screen.getByLabelText('Department')).toHaveAttribute(
      'id',
      'department-id',
    )
  })

  it('renders an error message with an alert role', () => {
    render(
      <FormField label="Amount" error="Amount is required" messageId="amount-message">
        <input id="amount" aria-describedby="amount-message" />
      </FormField>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Amount is required')
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'amount-message')
  })
})
