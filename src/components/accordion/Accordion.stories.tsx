import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion } from './Accordion'

const meta = { title: 'Disclosure/Accordion', component: Accordion } satisfies Meta<typeof Accordion>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { args: { items: [{ id: 'summary', title: 'Order summary', content: 'Six purchase orders are queued for review.' }, { id: 'status', title: 'Status definitions', content: 'Pending orders require review before approval.' }] } }
