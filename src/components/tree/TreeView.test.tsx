import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TreeView, type TreeNode } from './TreeView'

const sample: TreeNode[] = [
  {
    id: 'animals',
    label: 'Animals',
    children: [
      { id: 'cat', label: 'Cat' },
      { id: 'dog', label: 'Dog' },
    ],
  },
  { id: 'plants', label: 'Plants' },
]

describe('TreeView', () => {
  it('renders root nodes', () => {
    render(<TreeView items={sample} />)
    expect(screen.getByRole('tree')).toBeInTheDocument()
    expect(screen.getByRole('treeitem', { name: 'Animals' })).toBeInTheDocument()
    expect(screen.getByRole('treeitem', { name: 'Plants' })).toBeInTheDocument()
  })

  it('shows empty state when items is empty', () => {
    render(<TreeView items={[]} />)
    expect(screen.getByText('No items')).toBeInTheDocument()
  })

  it('expands a branch node on click', async () => {
    const user = userEvent.setup()
    render(<TreeView items={sample} />)
    const branch = screen.getByRole('treeitem', { name: 'Animals' })
    expect(branch).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('treeitem', { name: 'Cat' })).toBeInTheDocument()
    await user.click(branch)
    expect(branch).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('treeitem', { name: 'Cat' })).not.toBeInTheDocument()
  })

  it('calls onNodeSelect when a node is clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<TreeView items={sample} onNodeSelect={onSelect} />)
    await user.click(screen.getByRole('treeitem', { name: 'Cat' }))
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'cat', label: 'Cat' }),
    )
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<TreeView items={sample} />)
    const firstItem = screen.getByRole('treeitem', { name: 'Animals' })
    firstItem.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('treeitem', { name: 'Cat' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('treeitem', { name: 'Dog' })).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('treeitem', { name: 'Cat' })).toHaveFocus()
  })

  it('moves from a child back to its parent with ArrowLeft', async () => {
    const user = userEvent.setup()
    render(<TreeView items={sample} />)
    const cat = screen.getByRole('treeitem', { name: 'Cat' })
    cat.focus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('treeitem', { name: 'Animals' })).toHaveFocus()
    expect(screen.getByRole('treeitem', { name: 'Animals' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('collapses an expanded node with ArrowLeft', async () => {
    const user = userEvent.setup()
    render(<TreeView items={sample} />)
    const branch = screen.getByRole('treeitem', { name: 'Animals' })
    branch.focus()
    await user.keyboard('{ArrowLeft}')
    expect(branch).toHaveAttribute('aria-expanded', 'false')
  })

  it('re-expands with ArrowRight', async () => {
    const user = userEvent.setup()
    render(<TreeView items={sample} />)
    const branch = screen.getByRole('treeitem', { name: 'Animals' })
    await user.click(branch)
    expect(branch).toHaveAttribute('aria-expanded', 'false')
    branch.focus()
    await user.keyboard('{ArrowRight}')
    expect(branch).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('treeitem', { name: 'Cat' })).toBeInTheDocument()
  })

  it('skips disabled nodes during keyboard navigation', async () => {
    const items: TreeNode[] = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B', disabled: true },
      { id: 'c', label: 'C' },
    ]
    const user = userEvent.setup()
    render(<TreeView items={items} />)
    const a = screen.getByRole('treeitem', { name: 'A' })
    a.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('treeitem', { name: 'C' })).toHaveFocus()
  })

  it('supports controlled expandedIds', () => {
    const { rerender } = render(
      <TreeView items={sample} expandedIds={['animals']} />,
    )
    expect(screen.getByRole('treeitem', { name: 'Cat' })).toBeInTheDocument()
    rerender(<TreeView items={sample} expandedIds={[]} />)
    expect(screen.queryByRole('treeitem', { name: 'Cat' })).not.toBeInTheDocument()
  })

  it('supports controlled onExpandedChange', async () => {
    const onExpandedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <TreeView
        items={sample}
        expandedIds={[]}
        onExpandedChange={onExpandedChange}
      />,
    )
    await user.click(screen.getByRole('treeitem', { name: 'Animals' }))
    expect(onExpandedChange).toHaveBeenCalledWith(
      expect.arrayContaining(['animals']),
    )
  })

  it('loads children lazily', async () => {
    const lazyItems: TreeNode[] = [
      {
        id: 'root',
        label: 'Root',
        children: [],
      },
    ]
    const loadChildren = vi.fn().mockResolvedValue([
      { id: 'child1', label: 'Child 1' },
    ])
    const user = userEvent.setup()
    render(<TreeView items={lazyItems} loadChildren={loadChildren} />)
    await user.click(screen.getByRole('treeitem', { name: 'Root' }))
    expect(loadChildren).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'root' }),
    )
    expect(await screen.findByRole('treeitem', { name: 'Child 1' })).toBeInTheDocument()
  })

  it('has correct aria attributes', () => {
    render(<TreeView items={sample} ariaLabel="Database schema" />)
    const tree = screen.getByRole('tree')
    expect(tree).toHaveAttribute('aria-label', 'Database schema')
    const branch = screen.getByRole('treeitem', { name: 'Animals' })
    expect(branch).toHaveAttribute('aria-level', '1')
    expect(branch).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders with custom icons', () => {
    const items: TreeNode[] = [
      { id: '1', label: 'Node', icon: <span data-testid="icon">🔧</span> },
    ]
    render(<TreeView items={items} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
