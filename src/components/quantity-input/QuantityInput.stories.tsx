import type { Meta, StoryObj } from '@storybook/react-vite'
import { QuantityInput } from './QuantityInput'

const meta = {
  title: 'Forms/QuantityInput',
  component: QuantityInput,
  tags: ['autodocs'],
  args: { label: 'Ordered quantity', unit: 'kg', defaultValue: 12.5, min: 0, step: 0.01 },
} satisfies Meta<typeof QuantityInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Invalid: Story = { args: { error: 'Quantity must be greater than zero.' } }
