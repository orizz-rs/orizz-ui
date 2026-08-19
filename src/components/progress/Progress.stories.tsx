import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './Progress'

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  args: { label: 'Approval progress', value: 65 },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Determinate: Story = {}
export const Indeterminate: Story = { args: { indeterminate: true, value: undefined, showValue: false } }
