import { useState } from 'react'
import type { JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Dialog } from './Dialog'

const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Dialog',
    children: null,
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

function DialogStory({ destructive = false }: { readonly destructive?: boolean }): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant={destructive ? 'danger' : 'primary'} onClick={() => setOpen(true)}>
        {destructive ? 'Delete record' : 'Open dialog'}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={destructive ? 'Delete record?' : 'Edit department'}
        description={
          destructive
            ? 'This action cannot be undone.'
            : 'Update the department details before saving.'
        }
      >
        <p>Dialog content belongs here.</p>
        <Button onClick={() => setOpen(false)}>Done</Button>
      </Dialog>
    </>
  )
}

export const Default: Story = {
  render: () => <DialogStory />,
}

export const Destructive: Story = {
  render: () => <DialogStory destructive />,
}
