import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { label: 'Due date', defaultValue: '2026-08-20', hint: 'Choose the expected completion date.' },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Error: Story = { args: { error: 'Choose a valid due date.' } }
