import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type JSX } from 'react'
import { SchemaTree } from './SchemaTree'
import type { DbNode } from './schema.types'

const meta = {
  title: 'Compositions/Database/SchemaTree',
  component: SchemaTree,
  args: { items: [] },
} satisfies Meta<typeof SchemaTree>
export default meta
type Story = StoryObj<typeof meta>

const serverCatalog: DbNode[] = [
  { id: 'catalog', name: 'shop_demo', type: 'catalog' },
]

async function loadCatalogChildren(node: DbNode): Promise<readonly DbNode[]> {
  if (node.type === 'catalog') {
    return [
      { id: 'public', name: 'public', type: 'schema' },
      { id: 'audit', name: 'audit', type: 'schema' },
    ]
  }
  if (node.type === 'schema') {
    if (node.id === 'public') {
      return [
        { id: 't-users', name: 'users', type: 'table' },
        { id: 't-orders', name: 'orders', type: 'table' },
        { id: 'v-active-users', name: 'active_users', type: 'view' },
      ]
    }
    return [{ id: 't-audit-log', name: 'audit_log', type: 'table' }]
  }
  if (node.type === 'table' || node.type === 'view') {
    const rows: readonly DbNode[] = [
      { id: `${node.id}-id`, name: 'id', type: 'column', dataType: 'uuid', isPrimaryKey: true },
      { id: `${node.id}-name`, name: 'name', type: 'column', dataType: 'text' },
      { id: `${node.id}-amount`, name: 'amount', type: 'column', dataType: 'numeric(12,2)', nullable: true },
      { id: `${node.id}-created`, name: 'created_at', type: 'column', dataType: 'timestamp', nullable: true },
    ]
    return node.type === 'view' ? [rows[0]] : rows
  }
  return []
}

function LazySchemaBrowserView(): JSX.Element {
  return (
    <SchemaTree
      items={serverCatalog}
      loadChildren={loadCatalogChildren}
      showColumnTypes
    />
  )
}

export const StaticSchema: Story = {
  args: {
    items: [
      { id: 'public', name: 'public', type: 'schema' },
      { id: 't-users', name: 'users', type: 'table' },
      { id: 't-orders', name: 'orders', type: 'table' },
    ],
  },
}

export const ColumnsWithTypes: Story = {
  args: {
    items: [
      { id: 't-users', name: 'users', type: 'table' },
      { id: 'users-id', name: 'id', type: 'column', dataType: 'uuid', isPrimaryKey: true },
      { id: 'users-email', name: 'email', type: 'column', dataType: 'text' },
      { id: 'users-amount', name: 'balance', type: 'column', dataType: 'numeric(12,2)', nullable: true },
    ],
  },
}

export const LazySchemaBrowser: Story = {
  render: LazySchemaBrowserView,
}

export function SelectedNodeReporter(): JSX.Element {
  const [selection, setSelection] = useState<DbNode | null>(null)
  return (
    <div>
      <SchemaTree
        items={[
          { id: 'public', name: 'public', type: 'schema' },
          { id: 't-users', name: 'users', type: 'table' },
        ]}
        onNodeSelect={setSelection}
      />
      <p>
        {selection ? `${selection.type}: ${selection.name}` : 'Nothing selected'}
      </p>
    </div>
  )
}