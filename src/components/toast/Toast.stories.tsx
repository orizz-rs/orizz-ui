import { useState } from 'react'
import type { JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Toast } from './Toast'

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  args: { open: true, title: 'Purchase order saved', children: 'The approval workflow has started.' },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Interactive: Story = {
  render: function InteractiveStory(): JSX.Element {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show toast</Button>
        <Toast open={open} tone="success" title="Saved" onDismiss={() => setOpen(false)} />
      </>
    )
  },
}
