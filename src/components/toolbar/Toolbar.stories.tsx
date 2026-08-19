import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Toolbar } from './Toolbar'

const meta = { title: 'Navigation/Toolbar', component: Toolbar } satisfies Meta<typeof Toolbar>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { start: <span>6 purchase orders</span>, end: <Button variant="secondary">Export</Button> } }
