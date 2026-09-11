import type { Meta, StoryObj } from '@storybook/react-vite'
import { TreeView, type TreeNode } from './TreeView'
import { Database, FileText, Folder, Table, Columns } from 'lucide-react'

const meta = { title: 'Data Display/TreeView', component: TreeView } satisfies Meta<typeof TreeView>
export default meta
type Story = StoryObj<typeof meta>

const fileTree: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: <Folder size={14} />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <Folder size={14} />,
        children: [
          { id: 'button', label: 'Button.tsx', icon: <FileText size={14} /> },
          { id: 'dialog', label: 'Dialog.tsx', icon: <FileText size={14} /> },
        ],
      },
      {
        id: 'hooks',
        label: 'hooks',
        icon: <Folder size={14} />,
        children: [
          { id: 'use-debounce', label: 'useDebounce.ts', icon: <FileText size={14} /> },
        ],
      },
    ],
  },
  {
    id: 'package-json',
    label: 'package.json',
    icon: <FileText size={14} />,
  },
]

const schemaTree: TreeNode[] = [
  {
    id: 'catalog',
    label: 'my_catalog',
    icon: <Database size={14} />,
    children: [
      {
        id: 'public-schema',
        label: 'public',
        icon: <Database size={14} />,
        children: [
          {
            id: 'users-table',
            label: 'users',
            icon: <Table size={14} />,
            children: [
              { id: 'users-id', label: 'id (uuid)', icon: <Columns size={14} /> },
              { id: 'users-name', label: 'name (text)', icon: <Columns size={14} /> },
              { id: 'users-email', label: 'email (text)', icon: <Columns size={14} /> },
            ],
          },
          {
            id: 'orders-table',
            label: 'orders',
            icon: <Table size={14} />,
            children: [
              { id: 'orders-id', label: 'id (uuid)', icon: <Columns size={14} /> },
              { id: 'orders-user-id', label: 'user_id (uuid)', icon: <Columns size={14} /> },
              { id: 'orders-total', label: 'total (numeric)', icon: <Columns size={14} /> },
            ],
          },
        ],
      },
    ],
  },
]

export const FileBrowser: Story = {
  args: { items: fileTree, ariaLabel: 'File browser' },
}

export const SchemaBrowser: Story = {
  args: { items: schemaTree, ariaLabel: 'Database schema' },
}

export const Controlled: Story = {
  args: {
    items: schemaTree,
    expandedIds: ['catalog'],
    ariaLabel: 'Controlled tree',
  },
}

export const LazyLoading: Story = {
  args: {
    items: [
      {
        id: 'root',
        label: 'Click to load children',
        icon: <Folder size={14} />,
        children: [],
      },
    ],
    loadChildren: async () => [
      { id: 'loaded-1', label: 'Loaded item 1', icon: <FileText size={14} /> },
      { id: 'loaded-2', label: 'Loaded item 2', icon: <FileText size={14} /> },
    ],
    ariaLabel: 'Lazy loading tree',
  },
}

export const DisabledNodes: Story = {
  args: {
    items: [
      { id: 'active', label: 'Active' },
      { id: 'disabled', label: 'Disabled', disabled: true },
      { id: 'another', label: 'Another active' },
    ],
    ariaLabel: 'Tree with disabled nodes',
  },
}
