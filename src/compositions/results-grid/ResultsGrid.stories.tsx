import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResultsGrid } from './ResultsGrid'
import type { ResultColumn } from './ResultsGrid.types'

const meta = {
  title: 'Compositions/Database/ResultsGrid',
  component: ResultsGrid,
} satisfies Meta<typeof ResultsGrid>
export default meta
type Story = StoryObj<typeof meta>

const columns: readonly ResultColumn[] = [
  { id: 'id', name: 'ID', dbType: 'uuid' },
  { id: 'customer_name', name: 'Customer', dbType: 'text' },
  { id: 'total', name: 'Total', dbType: 'numeric(12,2)' },
  { id: 'status', name: 'Status', dbType: 'varchar' },
  { id: 'created_at', name: 'Created', dbType: 'timestamp' },
]

const sampleRows = [
  {
    id: 'uuid-1',
    customer_name: 'Acme Corp',
    total: 12450.75,
    status: 'shipped',
    created_at: new Date('2026-08-15T10:30:00Z'),
  },
  {
    id: 'uuid-2',
    customer_name: 'Northstar Ltd',
    total: null,
    status: 'pending',
    created_at: new Date('2026-09-01T14:00:00Z'),
  },
  {
    id: 'uuid-3',
    customer_name: 'Green Fields',
    total: 890.0,
    status: null,
    created_at: new Date('2026-09-10T09:15:00Z'),
  },
  {
    id: 'uuid-4',
    customer_name: 'Bolt Inc',
    total: 4200.5,
    status: 'paid',
    created_at: null,
  },
]

export const Default: Story = {
  args: {
    columns,
    rows: sampleRows,
    title: 'Recent orders',
    onExport: (format) => {
      window.alert(`Exporting ${format}`)
    },
  },
}

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    title: 'No results yet',
  },
}

export const SingleRow: Story = {
  args: {
    columns,
    rows: [sampleRows[0]],
    title: 'Top result',
  },
}

export const Loading: Story = {
  args: {
    columns,
    rows: [],
    loading: true,
  },
}