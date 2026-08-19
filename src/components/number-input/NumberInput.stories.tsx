import type { Meta, StoryObj } from '@storybook/react-vite'
import { NumberInput } from './NumberInput'

const meta = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  args: {
    label: 'Quantity',
    min: 0,
    step: 1,
  },
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Decimal: Story = {
  args: {
    label: 'Unit price',
    step: 0.01,
    min: 0,
  },
}

export const Invalid: Story = {
  args: {
    error: 'Quantity must be greater than zero.',
  },
}
