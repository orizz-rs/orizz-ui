import type { Meta, StoryObj } from '@storybook/react-vite'
import { PercentageInput } from './PercentageInput'

const meta = {
  title: 'Forms/PercentageInput',
  component: PercentageInput,
  tags: ['autodocs'],
  args: { label: 'Tax rate', defaultValue: 7, min: 0, max: 100, step: 0.01 },
} satisfies Meta<typeof PercentageInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Error: Story = { args: { error: 'Enter a value between 0 and 100.' } }
