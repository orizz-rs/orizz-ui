import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Alert } from './Alert'

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title: 'Your workspace is ready',
    children: 'Invite your team to start collaborating.',
    tone: 'success',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    tone: 'info',
    title: 'New version available',
    action: <Button size="sm">Update now</Button>,
  },
}
