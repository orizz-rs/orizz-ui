import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline } from './Timeline'

const meta = { title: 'Feedback/Timeline', component: Timeline } satisfies Meta<typeof Timeline>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { args: { items: [{ id: 'created', title: 'Order created', description: 'Niran Chai submitted the order.', timestamp: '09:30' }, { id: 'reviewed', title: 'Reviewed by finance', timestamp: '10:15', tone: 'success' }] } }
