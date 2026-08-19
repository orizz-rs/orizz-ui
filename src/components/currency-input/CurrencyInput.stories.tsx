import type { Meta, StoryObj } from '@storybook/react-vite'
import { CurrencyInput } from './CurrencyInput'

const meta = {
  title: 'Forms/CurrencyInput',
  component: CurrencyInput,
  args: {
    label: 'Unit price',
    currency: 'THB',
    min: 0,
    step: 0.01,
  },
} satisfies Meta<typeof CurrencyInput>

export default meta
type Story = StoryObj<typeof meta>

export const ThaiBaht: Story = {}

export const USDollar: Story = {
  args: {
    currency: 'USD',
  },
}
