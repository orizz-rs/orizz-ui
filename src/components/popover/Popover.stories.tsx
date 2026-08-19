import { useState } from 'react'
import type { JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Popover } from './Popover'

const meta = {
  title: 'Overlay/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  args: {
    open: false,
    onOpenChange: () => undefined,
    trigger: <Button>Open popover</Button>,
    children: null,
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

function PopoverStory({ align }: { readonly align: 'start' | 'center' | 'end' }): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={<Button variant="secondary">Open filters</Button>}
      title="Filter status"
      align={align}
    >
      <label>
        Status
        <select defaultValue="all">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </label>
    </Popover>
  )
}

export const Start: Story = { render: () => <PopoverStory align="start" /> }
export const Center: Story = { render: () => <PopoverStory align="center" /> }
export const End: Story = { render: () => <PopoverStory align="end" /> }
