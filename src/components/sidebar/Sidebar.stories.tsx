import type { Meta, StoryObj } from '@storybook/react-vite'
import { LayoutDashboard, Settings, Users } from 'lucide-react'
import { Sidebar } from './Sidebar'

const meta = { title: 'Navigation/Sidebar', component: Sidebar } satisfies Meta<typeof Sidebar>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    groups: [{ id: 'workspace', label: 'Workspace', items: [{ id: 'overview', label: 'Overview', icon: <LayoutDashboard />, active: true }, { id: 'members', label: 'Members', icon: <Users /> }, { id: 'settings', label: 'Settings', icon: <Settings /> }] }],
  },
}
