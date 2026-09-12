import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SchemaTree } from './SchemaTree'
import type { DbNode } from './schema.types'

const items: readonly DbNode[] = [
  { id: 'public', name: 'public', type: 'schema' },
  { id: 'users-table', name: 'users', type: 'table' },
]

describe('SchemaTree', () => {
  it('renders root nodes with the schema tree role', () => {
    render(<SchemaTree items={items} />)
    expect(screen.getByRole('tree')).toHaveAttribute(
      'aria-label',
      'Database schema',
    )
    expect(screen.getByRole('treeitem', { name: 'public' })).toBeInTheDocument()
    expect(screen.getByRole('treeitem', { name: 'users' })).toBeInTheDocument()
  })

  it('shows the data type next to column names', () => {
    render(
      <SchemaTree
        items={[{ id: 'email', name: 'email', type: 'column', dataType: 'text' }]}
      />,
    )
    expect(
      screen.getByRole('treeitem', { name: 'email (text)' }),
    ).toBeInTheDocument()
  })

  it('hides column types when disabled', () => {
    render(
      <SchemaTree
        items={[{ id: 'email', name: 'email', type: 'column', dataType: 'text' }]}
        showColumnTypes={false}
      />,
    )
    expect(screen.getByRole('treeitem', { name: 'email' })).toBeInTheDocument()
  })

  it('lazily loads children through the loadChildren callback', async () => {
    const loadChildren = vi.fn().mockResolvedValue([
      { id: 'row-id', name: 'id', type: 'column', dataType: 'uuid' },
      { id: 'row-name', name: 'name', type: 'column', dataType: 'text' },
    ])
    const user = userEvent.setup()
    render(
      <SchemaTree
        items={[
          { id: 'users-table', name: 'users', type: 'table' },
        ]}
        loadChildren={loadChildren}
      />,
    )
    await user.click(screen.getByRole('treeitem', { name: 'users' }))
    expect(loadChildren).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'users-table', type: 'table' }),
    )
    expect(
      await screen.findByRole('treeitem', { name: 'id (uuid)' }),
    ).toBeInTheDocument()
  })

  it('reports the DbNode on selection', async () => {
    const onNodeSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <SchemaTree
        items={[
          { id: 'orders-table', name: 'orders', type: 'table' },
        ]}
        onNodeSelect={onNodeSelect}
      />,
    )
    await user.click(screen.getByRole('treeitem', { name: 'orders' }))
    expect(onNodeSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'orders-table', type: 'table' }),
    )
  })

  it('supports controlled expandedIds', async () => {
    const { rerender } = render(
      <SchemaTree
        items={[
          { id: 'users', name: 'users', type: 'table' },
        ]}
        expandedIds={['users']}
        loadChildren={async () => [
          { id: 'users-id', name: 'id', type: 'column', dataType: 'uuid' },
        ]}
      />,
    )
    expect(
      await screen.findByRole('treeitem', { name: 'id (uuid)' }),
    ).toBeInTheDocument()
    rerender(
      <SchemaTree
        items={[
          { id: 'users', name: 'users', type: 'table' },
        ]}
        expandedIds={[]}
        loadChildren={async () => [
          { id: 'users-id', name: 'id', type: 'column', dataType: 'uuid' },
        ]}
      />,
    )
    expect(
      screen.queryByRole('treeitem', { name: 'id (uuid)' }),
    ).not.toBeInTheDocument()
  })

  it('renders no items message for an empty tree', () => {
    render(<SchemaTree items={[]} />)
    expect(screen.getByText('No items')).toBeInTheDocument()
  })
})