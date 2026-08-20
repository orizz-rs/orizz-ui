import { useCallback, type JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AsyncCombobox } from './AsyncCombobox'

const customers = [
  { value: 'acme', label: 'Acme Co.', description: 'CUS-001' },
  { value: 'green-field', label: 'Green Field Ltd.', description: 'CUS-002' },
  { value: 'northstar', label: 'Northstar Supply', description: 'CUS-003' },
]

const meta = { title: 'Forms/AsyncCombobox', component: AsyncCombobox, tags: ['autodocs'] } satisfies Meta<typeof AsyncCombobox>
export default meta
type Story = StoryObj<typeof meta>

export function Default(): JSX.Element {
  const loadOptions = useCallback(async (query: string) => customers.filter((customer) => customer.label.toLowerCase().includes(query.toLowerCase())), [])
  return <AsyncCombobox label="Customer" loadOptions={loadOptions} hint="Searches when the query changes." />
}

export const Error: Story = { args: { label: 'Customer', loadOptions: async () => [], error: 'Customer is required.' } }
