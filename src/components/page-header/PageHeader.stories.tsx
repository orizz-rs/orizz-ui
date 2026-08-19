import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { PageHeader } from './PageHeader'

const meta = { title: 'Navigation/PageHeader', component: PageHeader } satisfies Meta<typeof PageHeader>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { eyebrow: 'Procurement', title: 'Purchase orders', description: 'Review and manage incoming purchase orders.', actions: <Button>New order</Button> } }
