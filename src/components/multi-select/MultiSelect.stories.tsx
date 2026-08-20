import { useState, type JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MultiSelect } from './MultiSelect'

const options = [
  { value: 'finance', label: 'Finance', description: 'Invoices and reporting' },
  { value: 'operations', label: 'Operations', description: 'Orders and fulfillment' },
  { value: 'people', label: 'People', description: 'Team and permissions' },
]

const meta = { title: 'Forms/MultiSelect', component: MultiSelect, tags: ['autodocs'], args: { label: 'Teams', options } } satisfies Meta<typeof MultiSelect>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithDefaults: Story = { args: { defaultValue: ['finance', 'people'] } }
export const Error: Story = { args: { error: 'Choose at least one team.' } }

export function Controlled(): JSX.Element {
  const [values, setValues] = useState<readonly string[]>(['finance'])
  return <MultiSelect label="Teams" options={options} value={values} onValueChange={setValues} />
}
