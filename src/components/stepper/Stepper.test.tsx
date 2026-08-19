import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Stepper } from './Stepper'

describe('Stepper', () => {
  it('marks current step and emits changes', () => {
    const onStepChange = vi.fn()
    render(<Stepper current="review" onStepChange={onStepChange} items={[{ id: 'draft', label: 'Draft', status: 'complete' }, { id: 'review', label: 'Review' }]} />)
    expect(screen.getByRole('button', { current: 'step' })).toBeInTheDocument()
    screen.getByRole('button', { name: 'Draft' }).click()
    expect(onStepChange).toHaveBeenCalledWith('draft')
  })
})
