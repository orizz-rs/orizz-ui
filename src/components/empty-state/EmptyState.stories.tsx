import { FileText } from 'lucide-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  args: {
    title: 'No purchase orders',
    description: 'Create your first purchase order to start the approval workflow.',
    icon: <FileText />,
    action: <Button>Create purchase order</Button>,
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
