import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    label: 'Description',
    placeholder: 'Describe your project',
    hint: 'Maximum 500 characters.',
    fullWidth: true,
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Error: Story = {
  args: { error: 'Description is required.', hint: undefined },
}
