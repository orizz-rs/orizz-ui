import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Form, FormActions } from './Form'

describe('Form', () => {
  it('announces a form-level error', () => {
    render(<Form error="Save failed."><button type="submit">Save</button></Form>)
    expect(screen.getByRole('alert')).toHaveTextContent('Save failed.')
  })

  it('marks a submitting form as busy', () => {
    render(<Form isSubmitting aria-label="Project form"><button type="submit">Save</button></Form>)
    expect(screen.getByRole('form', { name: 'Project form' })).toHaveAttribute('aria-busy', 'true')
  })

  it('renders action alignment', () => {
    render(<FormActions align="start"><button type="button">Cancel</button></FormActions>)
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })
})
