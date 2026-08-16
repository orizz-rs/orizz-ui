import type { JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
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
  { id: 'role', header: 'Role', accessor: 'role', sortable: true },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
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
    filterable: false,
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
      filterPlaceholder="Search members…"
      initialSort={{ columnId: 'member', direction: 'asc' }}
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
  component: MemberDataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MemberDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValidationErrors: Story = {
  render: () => <InvalidDataTable />,
}
