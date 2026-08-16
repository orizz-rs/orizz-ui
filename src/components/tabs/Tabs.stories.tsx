import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './Tabs'

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Workspace settings',
    items: [
      { id: 'general', label: 'General', content: 'General workspace settings.' },
      { id: 'members', label: 'Members', content: 'Manage workspace members.' },
      { id: 'billing', label: 'Billing', content: 'Billing is unavailable.', disabled: true },
    ],
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
