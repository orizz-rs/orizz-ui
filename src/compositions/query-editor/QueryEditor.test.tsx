import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QueryEditor } from './QueryEditor'

describe('QueryEditor', () => {
  it('renders a labelled SQL editor by default', () => {
    render(<QueryEditor defaultValue="SELECT 1" />)
    expect(screen.getByLabelText('Query')).toHaveValue('SELECT 1')
    expect(screen.getByRole('button', { name: 'Run query' })).toBeInTheDocument()
  })

  it('renders a custom label', () => {
    render(<QueryEditor label="Sales query" />)
    expect(screen.getByLabelText('Sales query')).toBeInTheDocument()
  })

  it('runs the query from the Run button', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<QueryEditor defaultValue="SELECT * FROM customers" onRun={onRun} />)
    await user.click(screen.getByRole('button', { name: 'Run query' }))
    expect(onRun).toHaveBeenCalledWith('SELECT * FROM customers')
  })

  it('runs the query from Ctrl+Enter inside the editor', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<QueryEditor defaultValue="SELECT 42" onRun={onRun} />)
    await user.click(screen.getByLabelText('Query'))
    await user.keyboard('{Control>}{Enter}{/Control}')
    expect(onRun).toHaveBeenCalledWith('SELECT 42')
  })

  it('does not insert an indented newline on Ctrl+Enter', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<QueryEditor defaultValue="SELECT 42" onRun={onRun} />)
    const editor = screen.getByLabelText('Query')
    await user.click(editor)
    await user.keyboard('{Control>}{Enter}{/Control}')
    expect(editor).toHaveValue('SELECT 42')
  })

  it('joins multiple statements when running', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(
      <QueryEditor defaultValue="SELECT 1; SELECT 2;" onRun={onRun} />,
    )
    await user.click(screen.getByRole('button', { name: 'Run query' }))
    expect(onRun).toHaveBeenCalledWith('SELECT 1;\nSELECT 2')
  })

  it('does not run when there is no runnable statement', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<QueryEditor defaultValue="-- just a comment" onRun={onRun} />)
    await user.click(screen.getByRole('button', { name: 'Run query' }))
    expect(onRun).not.toHaveBeenCalled()
  })

  it('reports the query history after running', async () => {
    const user = userEvent.setup()
    const onHistoryChange = vi.fn()
    render(
      <QueryEditor defaultValue="SELECT 1" onHistoryChange={onHistoryChange} />,
    )
    await user.click(screen.getByRole('button', { name: 'Run query' }))
    expect(onHistoryChange).toHaveBeenCalledWith(['SELECT 1'])
  })

  it('shows Cancel and reports cancellation while running', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<QueryEditor isRunning onCancel={onCancel} />)
    expect(screen.queryByRole('button', { name: 'Run' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancel running query' }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('reports typed changes to the caller', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<QueryEditor onValueChange={onValueChange} />)
    await user.type(screen.getByLabelText('Query'), 'SELECT 9')
    expect(onValueChange).toHaveBeenLastCalledWith('SELECT 9')
  })
})