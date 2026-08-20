import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../checkbox'
import { Fieldset } from './Fieldset'

const meta = {
  title: 'Forms/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  args: {
    legend: 'Notification preferences',
    description: 'Choose the updates this user should receive.',
    children: <Checkbox label="Email notifications" defaultChecked />,
  },
} satisfies Meta<typeof Fieldset>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
