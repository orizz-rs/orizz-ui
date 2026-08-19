import type { Meta, StoryObj } from '@storybook/react-vite'
import { Combobox, type ComboboxOption } from './Combobox'

const warehouses: readonly ComboboxOption[] = [
  { value: 'bkk', label: 'Bangkok warehouse', description: 'WH-BKK · 1,240 items' },
  { value: 'cnx', label: 'Chiang Mai warehouse', description: 'WH-CNX · 680 items' },
  { value: 'hdy', label: 'Hat Yai warehouse', description: 'WH-HDY · 420 items' },
]

const meta = {
  title: 'Forms/Combobox',
  component: Combobox,
  args: {
    label: 'Warehouse',
    options: warehouses,
    placeholder: 'Search warehouses…',
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: {
    error: 'Please choose a warehouse.',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}
