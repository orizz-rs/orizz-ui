import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConnectionForm } from './ConnectionForm'

function renderOpen(): ReturnType<typeof render> {
  return render(
    <ConnectionForm open onOpenChange={vi.fn()} />,
  )
}

describe('ConnectionForm', () => {
  it('renders the fields inside the dialog', () => {
    renderOpen()
    expect(screen.getByLabelText('Connection name')).toBeInTheDocument()
    expect(screen.getByLabelText('Engine')).toBeInTheDocument()
    expect(screen.getByLabelText('Host')).toBeInTheDocument()
    expect(screen.getByLabelText('Port')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('seeds fields from initialValues', () => {
    render(
      <ConnectionForm
        open
        onOpenChange={vi.fn()}
        initialValues={{
          name: 'prod',
          host: 'db.prod.example',
          engine: 'mysql',
        }}
      />,
    )
    expect(screen.getByLabelText('Connection name')).toHaveValue('prod')
    expect(screen.getByLabelText('Host')).toHaveValue('db.prod.example')
    expect(screen.getByLabelText('Engine')).toHaveValue('mysql')
    expect(screen.getByLabelText('Port')).toHaveValue('3306')
  })

  it('calls onConnect with the entered values', async () => {
    const onConnect = vi.fn()
    const user = userEvent.setup()
    render(<ConnectionForm open onOpenChange={vi.fn()} onConnect={onConnect} />)
    await user.type(screen.getByLabelText('Connection name'), 'Analytics')
    await user.type(screen.getByLabelText('Host'), 'warehouse.example.com')
    await user.type(screen.getByLabelText('Database'), 'analytics')
    await user.type(screen.getByLabelText('Username'), 'dba')
    await user.type(screen.getByLabelText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'Connect' }))
    expect(onConnect).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Analytics',
        host: 'warehouse.example.com',
        engine: 'postgresql',
        database: 'analytics',
        username: 'dba',
        password: 'secret',
        ssl: false,
      }),
    )
  })

  it('shows validation errors and does not connect when required fields are empty', async () => {
    const onConnect = vi.fn()
    const user = userEvent.setup()
    render(<ConnectionForm open onOpenChange={vi.fn()} onConnect={onConnect} />)
    await user.click(screen.getByRole('button', { name: 'Connect' }))
    expect(
      screen.getByText('Connection name is required.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Host is required.')).toBeInTheDocument()
    expect(onConnect).not.toHaveBeenCalled()
  })

  it('rejects a non-numeric port', async () => {
    const onConnect = vi.fn()
    const user = userEvent.setup()
    render(<ConnectionForm open onOpenChange={vi.fn()} onConnect={onConnect} />)
    await user.type(screen.getByLabelText('Connection name'), 'Demo')
    await user.type(screen.getByLabelText('Host'), 'localhost')
    await user.clear(screen.getByLabelText('Port'))
    await user.type(screen.getByLabelText('Port'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Connect' }))
    expect(screen.getByText('Port must be a number (1–65535).')).toBeInTheDocument()
    expect(onConnect).not.toHaveBeenCalled()
  })

  it('switches the port when the engine changes', async () => {
    const onConnect = vi.fn()
    const user = userEvent.setup()
    render(<ConnectionForm open onOpenChange={vi.fn()} onConnect={onConnect} />)
    await user.selectOptions(screen.getByLabelText('Engine'), 'mysql')
    expect(screen.getByLabelText('Port')).toHaveValue('3306')
    await user.selectOptions(screen.getByLabelText('Engine'), 'sqlserver')
    expect(screen.getByLabelText('Port')).toHaveValue('1433')
  })

  it('calls onTest with the entered values', async () => {
    const onTest = vi.fn()
    const user = userEvent.setup()
    render(<ConnectionForm open onOpenChange={vi.fn()} onTest={onTest} />)
    await user.type(screen.getByLabelText('Connection name'), 'Local')
    await user.type(screen.getByLabelText('Host'), 'localhost')
    await user.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(onTest).toHaveBeenCalledWith(
      expect.objectContaining({ host: 'localhost' }),
    )
  })

  it('shows a global error passed as a prop', () => {
    render(
      <ConnectionForm
        open
        onOpenChange={vi.fn()}
        error="Connection refused by the server."
      />,
    )
    expect(
      screen.getByText('Connection refused by the server.'),
    ).toBeInTheDocument()
  })

  it('toggles the SSL checkbox', async () => {
    const onConnect = vi.fn()
    const user = userEvent.setup()
    render(<ConnectionForm open onOpenChange={vi.fn()} onConnect={onConnect} />)
    await user.click(screen.getByRole('checkbox', { name: 'Use SSL/TLS' }))
    await user.type(screen.getByLabelText('Connection name'), 'Local')
    await user.type(screen.getByLabelText('Host'), 'localhost')
    await user.click(screen.getByRole('button', { name: 'Connect' }))
    expect(onConnect).toHaveBeenCalledWith(
      expect.objectContaining({ ssl: true }),
    )
  })
})