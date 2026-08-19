import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingOverlay } from './LoadingOverlay'

const meta = { title: 'Feedback/LoadingOverlay', component: LoadingOverlay } satisfies Meta<typeof LoadingOverlay>
export default meta
type Story = StoryObj<typeof meta>
export const Loading: Story = { args: { children: <div>Purchase order details</div>, label: 'Loading order' } }
