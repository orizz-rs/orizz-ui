import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DataTable } from './DataTable'
import type { DataTableColumn } from './DataTable.types'

interface PersonRow {
  readonly id: string
  readonly name: string
  readonly age: number
  readonly active: boolean
}

const people: readonly PersonRow[] = [
  { id: 'p1', name: 'Alice', age: 32, active: true },
  { id: 'p2', name: 'Bob', age: 24, active: false },
]

const columns: readonly DataTableColumn<PersonRow>[] = [
  {
    id: 'name',
    header: 'Member',
    accessor: 'name',
    sortable: true,
    filter: { type: 'text', placeholder: 'Search members…' },
  },
  { id: 'age', header: 'Age', accessor: 'age', sortable: true },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (row.active ? 'Active member' : 'Inactive member'),
    filterValue: (row) => (row.active ? 'active' : 'inactive'),
    filter: {
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
  },
]

describe('DataTable', () => {
  it('renders custom headers and cells', () => {
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />)

    expect(screen.getByRole('columnheader', { name: /Member/ })).toBeVisible()
    expect(screen.getByText('Active member')).toBeVisible()
  })

  it('filters text within its header column', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />)

    await user.type(screen.getByRole('searchbox', { name: 'Filter Member' }), 'alice')

    expect(screen.getByText('Alice')).toBeVisible()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('1 of 2 rows')).toBeVisible()
  })

  it('filters limited status values from a header select', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />)

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter Status' }),
      'inactive',
    )

    expect(screen.getByText('Bob')).toBeVisible()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('combines filters from multiple columns', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />)

    await user.type(screen.getByRole('searchbox', { name: 'Filter Member' }), 'bob')
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter Status' }),
      'active',
    )

    expect(screen.getByText('No matching data found.')).toBeVisible()
    expect(screen.getByText('0 of 2 rows')).toBeVisible()
  })

  it('sorts rows in ascending and descending order', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />)

    await user.click(screen.getByRole('button', { name: 'Sort Age ascending' }))
    let rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)
    expect(rows[0]).toHaveTextContent('Bob')

    await user.click(screen.getByRole('button', { name: 'Sort Age descending' }))
    rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)
    expect(rows[0]).toHaveTextContent('Alice')
  })

  it('reports missing required data', () => {
    interface IncompleteRow {
      readonly id: string
      readonly name: string
      readonly email?: string
    }
    const incompleteColumns: readonly DataTableColumn<IncompleteRow>[] = [
      { id: 'name', header: 'Name', accessor: 'name' },
      { id: 'email', header: 'Email', accessor: 'email', required: true },
    ]
    const incompleteData: readonly IncompleteRow[] = [{ id: 'p1', name: 'Alice' }]

    render(
      <DataTable
        columns={incompleteColumns}
        data={incompleteData}
        getRowId={(row) => row.id}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Column "email" is missing required values in rows: p1.',
    )
    expect(screen.getByRole('table')).toBeVisible()
  })

  it('blocks rendering when row IDs are duplicated', () => {
    const duplicateRows: readonly PersonRow[] = [people[0], people[0]]
    render(
      <DataTable columns={columns} data={duplicateRows} getRowId={(row) => row.id} />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Row ID "p1" is duplicated.')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('validates select filter options before rendering', () => {
    const invalidColumns: readonly DataTableColumn<PersonRow>[] = [
      {
        id: 'status',
        header: 'Status',
        accessor: 'active',
        filter: { type: 'select', options: [] },
      },
    ]

    render(
      <DataTable columns={invalidColumns} data={people} getRowId={(row) => row.id} />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Select filter for column "status" needs at least one option.',
    )
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
