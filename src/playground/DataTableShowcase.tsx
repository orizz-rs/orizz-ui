import type { JSX } from 'react'
import { DataTable } from '../index'

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

export function DataTableShowcase(): JSX.Element {
  return (
    <section className="section" aria-labelledby="data-table-title">
      <div className="section__heading">
        <div>
          <span className="eyebrow">Data display</span>
          <h2 id="data-table-title">Pass data. The table handles the rest.</h2>
        </div>
        <p>
          Headers, row keys, sorting, and the right filter control are inferred
          automatically. Add a custom column schema only when you need it.
        </p>
      </div>
      <DataTable
        data={projects}
        caption="Organization projects"
        initialSort={{ columnId: 'updated', direction: 'desc' }}
      />
    </section>
  )
}
