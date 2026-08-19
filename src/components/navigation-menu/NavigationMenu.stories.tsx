import type { Meta, StoryObj } from '@storybook/react-vite'
import { NavigationMenu } from './NavigationMenu'

const meta = { title: 'Navigation/NavigationMenu', component: NavigationMenu } satisfies Meta<typeof NavigationMenu>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { args: { items: [{ id: 'dashboard', label: 'Dashboard', active: true }, { id: 'orders', label: 'Orders' }, { id: 'reports', label: 'Reports' }] } }
