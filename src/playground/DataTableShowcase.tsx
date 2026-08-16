import type { JSX } from 'react'
import {
  Avatar,
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
} from '../index'

interface ProjectRow {
  readonly id: string
  readonly project: string
  readonly owner: string
  readonly status: 'healthy' | 'at-risk' | 'draft'
  readonly tasks: number
  readonly updated: string
}

const projects: readonly ProjectRow[] = [
  { id: 'pr1', project: 'Design system', owner: 'Mali Dee', status: 'healthy', tasks: 42, updated: '2026-08-16' },
  { id: 'pr2', project: 'Mobile app', owner: 'Niran Chai', status: 'at-risk', tasks: 28, updated: '2026-08-14' },
  { id: 'pr3', project: 'Partner portal', owner: 'Anan Wong', status: 'draft', tasks: 16, updated: '2026-08-10' },
  { id: 'pr4', project: 'Analytics', owner: 'Suda Nam', status: 'healthy', tasks: 35, updated: '2026-08-08' },
]

const statusTone = {
  healthy: 'success',
  'at-risk': 'warning',
  draft: 'neutral',
} as const

const columns: readonly DataTableColumn<ProjectRow>[] = [
  {
    id: 'project',
    header: 'Project & owner',
    accessor: 'project',
    sortable: true,
    filter: { type: 'text', placeholder: 'Search project or owner…' },
    filterValue: (row) => `${row.project} ${row.owner}`,
    cell: (row) => (
      <span className="data-table-member">
        <Avatar alt={row.owner} fallback={row.owner.slice(0, 2)} size="sm" />
        <span>
          <strong>{row.project}</strong>
          <small>{row.owner}</small>
        </span>
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Health',
    accessor: 'status',
    sortable: true,
    filter: {
      type: 'select',
      placeholder: 'All health',
      options: [
        { value: 'healthy', label: 'Healthy' },
        { value: 'at-risk', label: 'At risk' },
        { value: 'draft', label: 'Draft' },
      ],
    },
    cell: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge>,
  },
  {
    id: 'tasks',
    header: 'Tasks',
    accessor: 'tasks',
    sortable: true,
    align: 'end',
  },
  {
    id: 'updated',
    header: 'Last updated',
    accessor: 'updated',
    sortable: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <Button size="sm" variant="ghost">
        Open
      </Button>
    ),
    required: false,
    align: 'end',
  },
]

export function DataTableShowcase(): JSX.Element {
  return (
    <section className="section" aria-labelledby="data-table-title">
      <div className="section__heading">
        <div>
          <span className="eyebrow">Data display</span>
          <h2 id="data-table-title">Custom data, safely rendered</h2>
        </div>
        <p>
          Define type-safe columns, customize every cell, validate incoming
          rows, and let users filter or sort without extra dependencies.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={projects}
        getRowId={(row) => row.id}
        caption="Organization projects"
        initialSort={{ columnId: 'updated', direction: 'desc' }}
      />
    </section>
  )
}
