import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { ResultState } from './ResultState'

const meta = { title: 'Feedback/ResultState', component: ResultState } satisfies Meta<typeof ResultState>
export default meta
type Story = StoryObj<typeof meta>
export const Empty: Story = { args: { title: 'No purchase orders', description: 'Create a purchase order to start the approval workflow.', action: <Button>New order</Button> } }
