import { useState, type JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../../components/avatar'
import { Badge } from '../../components/badge'
import { Button } from '../../components/button'
import { DataTable } from './DataTable'
import type { DataTableColumn } from './DataTable.types'
import './DataTable.stories.css'

interface MemberRow {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly role: string
  readonly status: 'active' | 'invited'
  readonly projects: number
}

const members: readonly MemberRow[] = [
  { id: 'm1', name: 'Anan Wong', email: 'anan@orizz.dev', role: 'Admin', status: 'active', projects: 12 },
  { id: 'm2', name: 'Mali Dee', email: 'mali@orizz.dev', role: 'Designer', status: 'active', projects: 8 },
  { id: 'm3', name: 'Niran Chai', email: 'niran@orizz.dev', role: 'Developer', status: 'invited', projects: 3 },
]

const memberColumns: readonly DataTableColumn<MemberRow>[] = [
  {
    id: 'member',
    header: 'Member',
    accessor: 'name',
    sortable: true,
    filter: { type: 'text', placeholder: 'Search members…' },
    filterValue: (row) => `${row.name} ${row.email}`,
    cell: (row) => (
      <span className="member-cell">
        <Avatar alt={row.name} fallback={row.name.slice(0, 2)} size="sm" />
        <span>
          <strong>{row.name}</strong>
          <small>{row.email}</small>
        </span>
      </span>
    ),
  },
  {
    id: 'role',
    header: 'Role',
    accessor: 'role',
    sortable: true,
    filter: {
      type: 'select',
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Designer', label: 'Designer' },
        { value: 'Developer', label: 'Developer' },
      ],
    },
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    filter: {
      type: 'select',
      placeholder: 'All statuses',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'invited', label: 'Invited' },
      ],
    },
    cell: (row) => (
      <Badge tone={row.status === 'active' ? 'success' : 'warning'}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: 'projects',
    header: 'Projects',
    accessor: 'projects',
    sortable: true,
    align: 'end',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <Button size="sm" variant="ghost">
        View
      </Button>
    ),
    required: false,
    align: 'end',
  },
]

function MemberDataTable(): JSX.Element {
  return (
    <DataTable
      columns={memberColumns}
      data={members}
      getRowId={(row) => row.id}
      caption="Organization members"
      initialSort={{ columnId: 'member', direction: 'asc' }}
    />
  )
}

function AutomaticDataTable(): JSX.Element {
  return (
    <DataTable
      data={members}
      caption="Automatically configured organization members"
    />
  )
}

function InvalidDataTable(): JSX.Element {
  interface InvalidRow {
    readonly id: string
    readonly name: string
    readonly email?: string
  }

  const invalidColumns: readonly DataTableColumn<InvalidRow>[] = [
    { id: 'name', header: 'Name', accessor: 'name' },
    { id: 'email', header: 'Email', accessor: 'email', required: true },
  ]
  const invalidRows: readonly InvalidRow[] = [
    { id: 'm1', name: 'Anan Wong' },
    { id: 'm2', name: 'Mali Dee', email: 'mali@orizz.dev' },
  ]

  return (
    <DataTable
      columns={invalidColumns}
      data={invalidRows}
      getRowId={(row) => row.id}
      caption="Validation example"
    />
  )
}

const meta = {
  title: 'Data Display/DataTable',
  component: AutomaticDataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AutomaticDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AdvancedCustomization: Story = {
  render: () => <MemberDataTable />,
}

export const ValidationErrors: Story = {
  render: () => <InvalidDataTable />,
}

interface QueryRow {
  readonly id: string
  readonly table_name: string
  readonly row_count: number
  readonly size_bytes: number
  readonly updated_at: string
}

const queryResultColumns: readonly DataTableColumn<QueryRow>[] = [
  { id: 'table_name', header: 'table_name', accessor: 'table_name', minWidth: '12rem', sortable: true },
  { id: 'row_count', header: 'row_count', accessor: 'row_count', numeric: true, width: 120, sortable: true },
  { id: 'size_bytes', header: 'size_bytes', accessor: 'size_bytes', numeric: true, width: 140 },
  { id: 'updated_at', header: 'updated_at', accessor: 'updated_at', hidden: true },
]

const queryRows: readonly QueryRow[] = [
  { id: 't1', table_name: 'purchase_order', row_count: 128_450, size_bytes: 9_830_400, updated_at: '2026-09-10 08:12:44' },
  { id: 't2', table_name: 'customer', row_count: 12_884, size_bytes: 1_572_864, updated_at: '2026-09-10 08:12:44' },
  { id: 't3', table_name: 'invoice_line', row_count: 1_204_317, size_bytes: 83_886_080, updated_at: '2026-09-09 22:41:07' },
  { id: 't4', table_name: 'product', row_count: 8_102, size_bytes: 1_048_576, updated_at: '2026-09-09 22:41:07' },
  { id: 't5', table_name: 'warehouse_stock', row_count: 96_233, size_bytes: 7_340_032, updated_at: '2026-09-08 18:03:52' },
  { id: 't6', table_name: 'approval_log', row_count: 44_011, size_bytes: 4_194_304, updated_at: '2026-09-08 18:03:52' },
]

/** Database-client style result grid: compact rows, sticky header and row numbers. */
export function ResultsGrid(): JSX.Element {
  return (
    <DataTable
      columns={queryResultColumns}
      data={queryRows}
      getRowId={(row) => row.id}
      caption="Query result"
      density="compact"
      stickyHeader
      stickyFirstColumn
      showRowNumbers
      maxHeight="18rem"
      pageSize={5}
    />
  )
}

const serverDataset: readonly QueryRow[] = Array.from({ length: 12 }, (_, index) => ({
  id: `s${index + 1}`,
  table_name: `orizz_table_${index + 1}`,
  row_count: (index + 1) * 137,
  size_bytes: (index + 1) * 98_304,
  updated_at: `2026-08-${String((index % 28) + 1).padStart(2, '0')} 10:00:00`,
}))

/** Server-side paging: the app slices the dataset and reports the total. */
export function ServerSidePaging(): JSX.Element {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 4
  const rows = serverDataset.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  return (
    <DataTable
      columns={queryResultColumns}
      data={rows}
      getRowId={(row) => row.id}
      caption="Server-side query result"
      totalRows={serverDataset.length}
      pageIndex={pageIndex}
      onPageChange={setPageIndex}
      density="compact"
      showRowNumbers
      stickyHeader
      maxHeight="16rem"
    />
  )
}
