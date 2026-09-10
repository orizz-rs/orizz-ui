import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, type JSX } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CodeEditor } from './CodeEditor'

describe('CodeEditor', () => {
  it('renders a labelled text area with the given value and line numbers', () => {
    render(<CodeEditor label="Pricing rule" defaultValue={'const a = 1\nconst b = 2'} language="typescript" />)
    const textarea = screen.getByLabelText('Pricing rule')
    expect(textarea).toHaveValue('const a = 1\nconst b = 2')
    expect(screen.getByText('2 lines')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('reports typed changes to the caller', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<CodeEditor label="Script" onValueChange={onValueChange} />)
    await user.type(screen.getByLabelText('Script'), 'a')
    expect(onValueChange).toHaveBeenLastCalledWith('a')
  })

  it('inserts the language indent unit on Tab instead of moving focus', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<CodeEditor label="Script" defaultValue="const a = 1" language="python" onValueChange={onValueChange} />)
    const textarea = screen.getByLabelText('Script')
    await user.click(textarea)
    await user.keyboard('{End}')
    await user.keyboard('{Tab}')
    expect(onValueChange).toHaveBeenLastCalledWith('const a = 1    ')
    expect(textarea).toHaveFocus()
  })

  it('supports the controlled value contract', async () => {
    const user = userEvent.setup()
    function Controlled(): JSX.Element {
      const [value, setValue] = useState('const a = 1')
      return <CodeEditor label="Script" value={value} onValueChange={setValue} />
    }
    render(<Controlled />)
    const textarea = screen.getByLabelText('Script')
    await user.click(textarea)
    await user.keyboard('{End}b')
    expect(textarea).toHaveValue('const a = 1b')
  })

  it('keeps the text area read-only in read-only mode', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<CodeEditor label="Script" defaultValue="locked" readOnly onValueChange={onValueChange} />)
    const textarea = screen.getByLabelText('Script')
    expect(textarea).toHaveAttribute('readonly')
    await user.type(textarea, 'x')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByText('Read-only')).toBeInTheDocument()
  })

  it('detects the language from the file name', () => {
    render(<CodeEditor label="Migration" fileName="upsert_customer.sql" />)
    expect(screen.getByText('SQL')).toBeInTheDocument()
  })

  it('shows the language picker and reports language changes', async () => {
    const user = userEvent.setup()
    const onLanguageChange = vi.fn()
    render(<CodeEditor label="Script" language="typescript" onLanguageChange={onLanguageChange} />)
    await user.selectOptions(screen.getByLabelText('Language'), 'rust')
    expect(onLanguageChange).toHaveBeenCalledWith('rust')
  })
})
