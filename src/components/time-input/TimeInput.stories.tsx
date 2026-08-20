import type { Meta, StoryObj } from '@storybook/react-vite'
import { TimeInput } from './TimeInput'

const meta = {
  title: 'Forms/TimeInput',
  component: TimeInput,
  tags: ['autodocs'],
  args: { label: 'Delivery time', defaultValue: '09:30', hint: 'Use the local warehouse time.' },
} satisfies Meta<typeof TimeInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Error: Story = { args: { error: 'Choose a delivery time.' } }
