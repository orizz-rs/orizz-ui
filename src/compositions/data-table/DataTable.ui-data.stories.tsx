import type { JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../../components/avatar'
import { Badge } from '../../components/badge'
import { Button } from '../../components/button'
import { DataTable } from './DataTable'
import './DataTable.stories.css'

const componentRows = [
  {
    id: 'm1',
    member: (
      <span className="member-cell">
        <Avatar alt="Anan Wong" fallback="AW" size="sm" />
        <strong>Anan Wong</strong>
      </span>
    ),
    status: <Badge tone="success">Active</Badge>,
    projects: 12,
    action: <Button size="sm" variant="ghost">View</Button>,
  },
  {
    id: 'm2',
    member: (
      <span className="member-cell">
        <Avatar alt="Mali Dee" fallback="MD" size="sm" />
        <strong>Mali Dee</strong>
      </span>
    ),
    status: <Badge tone="warning">Invited</Badge>,
    projects: 8,
    action: <Button size="sm" variant="ghost">View</Button>,
  },
]

function UIComponentDataTable(): JSX.Element {
  return (
    <DataTable
      data={componentRows}
      caption="React UI components passed directly as row values"
    />
  )
}

const meta = {
  title: 'Data Display/DataTable/UI Component Data',
  component: UIComponentDataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof UIComponentDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
