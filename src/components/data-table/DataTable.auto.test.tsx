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

  it('renders React components as data without inferring invalid operations', () => {
    const componentRows = [
      {
        id: 'ui1',
        member: <strong>Alice</strong>,
        action: <button type="button">Open profile</button>,
      },
    ]

    render(<DataTable data={componentRows} />)

    expect(screen.getByText('Alice')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Open profile' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Sort Member ascending' }))
      .not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Open filter for Member' }))
      .not.toBeInTheDocument()
  })
})
