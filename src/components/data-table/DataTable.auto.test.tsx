import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DataTable } from './DataTable'

interface ProjectRow {
  readonly id: string
  readonly projectName: string
  readonly status: 'active' | 'paused'
  readonly tasks: number
}

const projects: readonly ProjectRow[] = [
  { id: 'p1', projectName: 'Alpha', status: 'active', tasks: 3 },
  { id: 'p2', projectName: 'Beta', status: 'paused', tasks: 1 },
  { id: 'p3', projectName: 'Gamma', status: 'active', tasks: 2 },
]

describe('DataTable automatic mode', () => {
  it('infers headers, row IDs, sorting, and filter controls from data', async () => {
    const user = userEvent.setup()
    render(<DataTable data={projects} />)

    expect(screen.getByRole('columnheader', { name: /Project Name/ })).toBeVisible()
    expect(screen.queryByRole('columnheader', { name: 'Id' })).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open filter for Status' }))
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter Status' }),
      'active',
    )
    expect(screen.getByText('Alpha')).toBeVisible()
    expect(screen.getByText('Gamma')).toBeVisible()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sort Tasks ascending' }))
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)
    expect(rows[0]).toHaveTextContent('Gamma')
  })

  it('infers filters from React component text and skips action columns', async () => {
    const user = userEvent.setup()
    const componentRows = [
      {
        id: 'ui1',
        member: <strong>Alice</strong>,
        status: <span>Active</span>,
        action: <button type="button">Open Alice</button>,
      },
      {
        id: 'ui2',
        member: <strong>Bob</strong>,
        status: <span>Invited</span>,
        action: <button type="button">Open Bob</button>,
      },
    ]

    render(<DataTable data={componentRows} />)

    expect(screen.getByText('Alice')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Open Alice' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Open filter for Member' }))
      .toBeVisible()
    expect(screen.getByRole('button', { name: 'Open filter for Status' }))
      .toBeVisible()
    expect(screen.queryByRole('button', { name: 'Open filter for Action' }))
      .not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open filter for Member' }))
    await user.type(screen.getByRole('searchbox', { name: 'Filter Member' }), 'alice')
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filter for Member' }))
    await user.click(screen.getByRole('button', { name: 'Open filter for Status' }))
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter Status' }),
      'Invited',
    )
    expect(screen.getByText('Bob')).toBeVisible()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })
})
