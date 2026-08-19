import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from './Stepper'

const meta = { title: 'Navigation/Stepper', component: Stepper } satisfies Meta<typeof Stepper>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { args: { current: 'review', items: [{ id: 'draft', label: 'Draft', status: 'complete' }, { id: 'review', label: 'Review order' }, { id: 'approve', label: 'Approval' }] } }
