import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

  it('opens, closes, and clears a text filter from its header', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />)

    expect(screen.queryByRole('searchbox', { name: 'Filter Member' }))
      .not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open filter for Member' }))
    const filterPopover = screen.getByRole('group', { name: 'Filter Member' })
    expect(filterPopover).toBeVisible()
    expect(screen.getByRole('table')).not.toContainElement(filterPopover)
    await user.type(screen.getByRole('searchbox', { name: 'Filter Member' }), 'alice')

    expect(screen.getByText('Alice')).toBeVisible()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('1 of 2 rows')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Close filter for Member' }))
    expect(screen.queryByRole('searchbox', { name: 'Filter Member' }))
      .not.toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filter for Member' }))
    expect(screen.getByText('Bob')).toBeVisible()
    expect(screen.getByText('2 of 2 rows')).toBeVisible()
  })

  it('dismisses a filter popup with Escape or an outside click', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />)

    await user.click(screen.getByRole('button', { name: 'Open filter for Member' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('group', { name: 'Filter Member' }))
      .not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open filter for Member' }))
      .toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Open filter for Status' }))
    await user.click(screen.getByText('2 of 2 rows'))
    expect(screen.queryByRole('group', { name: 'Filter Status' }))
      .not.toBeInTheDocument()
  })

  it('filters limited status values from a header select', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />)

    await user.click(screen.getByRole('button', { name: 'Open filter for Status' }))
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

    await user.click(screen.getByRole('button', { name: 'Open filter for Member' }))
    await user.type(screen.getByRole('searchbox', { name: 'Filter Member' }), 'bob')
    await user.click(screen.getByRole('button', { name: 'Open filter for Status' }))
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

  it('paginates rows and resets to the first page after a page-size change', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(row) => row.id}
        pageSizeOptions={[1, 10]}
      />,
    )

    expect(screen.getByText('Alice')).toBeVisible()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1–1 of 2')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Bob')).toBeVisible()
    expect(screen.getByText('Page 2 of 2')).toBeVisible()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Rows per page' }), '10')
    expect(screen.getByText('Alice')).toBeVisible()
    expect(screen.getByText('Bob')).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toHaveValue('10')
  })

  it('selects visible rows and exposes a bulk action slot', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(row) => row.id}
        selectable
        onSelectionChange={onSelectionChange}
        selectionActions={<button type="button">Archive selected</button>}
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Select row p1' }))
    expect(onSelectionChange).toHaveBeenLastCalledWith(['p1'])
    expect(screen.getByText('1 selected')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Archive selected' })).toBeVisible()

    await user.click(screen.getByRole('checkbox', { name: 'Select all visible rows' }))
    expect(onSelectionChange).toHaveBeenLastCalledWith(['p1', 'p2'])
  })

  it('renders loading and retryable error states', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(row) => row.id}
        loading
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Loading data…')
    rerender(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(row) => row.id}
        error="Unable to load members."
        onRetry={onRetry}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load members.')
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledOnce()
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

  it('renders the requested density and sticky settings', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(row) => row.id}
        density="compact"
        stickyHeader
        stickyFirstColumn
        maxHeight="20rem"
      />,
    )

    expect(container.firstElementChild).toHaveAttribute('data-density', 'compact')
    expect(container.querySelector('[data-sticky-header]')).not.toBeNull()
    expect(screen.getByRole('table')).toHaveAttribute('data-sticky-first')
  })

  it('shows row numbers continuing across pages', async () => {
    const user = userEvent.setup()
    const manyPeople: readonly PersonRow[] = Array.from({ length: 12 }, (_, index) => ({
      id: `p${index + 1}`,
      name: `Member ${index + 1}`,
      age: 20 + index,
      active: true,
    }))
    render(
      <DataTable
        columns={columns}
        data={manyPeople}
        getRowId={(row) => row.id}
        showRowNumbers
        pageSize={10}
      />,
    )

    const table = screen.getByRole('table')
    expect(within(table).getByText('1')).toBeInTheDocument()
    expect(within(table).getByText('10')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(within(table).getByText('11')).toBeInTheDocument()
    expect(within(table).queryByText('1')).not.toBeInTheDocument()
  })

  it('hides and re-shows columns from the column settings', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={people} getRowId={(row) => row.id} />)

    await user.click(screen.getByRole('button', { name: 'Columns' }))
    await user.click(screen.getByRole('checkbox', { name: 'Age' }))
    expect(screen.queryByRole('columnheader', { name: /Age/ })).not.toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Member/ })).toBeVisible()

    await user.click(screen.getByRole('checkbox', { name: 'Age' }))
    expect(screen.getByRole('columnheader', { name: /Age/ })).toBeVisible()
  })

  it('reports controlled sort changes without reordering rows in server mode', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(row) => row.id}
        totalRows={48}
        pageSize={2}
        sort={null}
        onSortChange={onSortChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Sort Member ascending' }))
    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'asc' })
    expect(screen.getByText('48 rows')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 24')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('reports controlled page and filter changes in server mode', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const onFiltersChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(row) => row.id}
        totalRows={48}
        pageSize={2}
        pageIndex={0}
        onPageChange={onPageChange}
        onFiltersChange={onFiltersChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(onPageChange).toHaveBeenCalledWith(1)

    await user.click(screen.getByRole('button', { name: 'Open filter for Member' }))
    await user.type(screen.getByRole('searchbox', { name: 'Filter Member' }), 'Al')
    expect(onFiltersChange).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'Al' }))
  })
})
