import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio } from './Radio'

const meta = {
  title: 'Forms/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: {
    name: 'plan',
    label: 'Professional',
    description: 'For growing teams that need more control.',
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }
