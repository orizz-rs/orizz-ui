import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormField } from './FormField'

const meta = {
  title: 'Forms/FormField',
  component: FormField,
  args: {
    label: 'Department',
    children: <input aria-label="Department control" />,
  },
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = {
  args: {
    required: true,
  },
}

export const Error: Story = {
  args: {
    error: 'Please select a department.',
  },
}
