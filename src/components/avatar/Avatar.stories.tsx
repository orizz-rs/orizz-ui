import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta = {
  title: 'Content/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    alt: 'Kong Suwan',
    fallback: 'KS',
    size: 'md',
    status: 'online',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    status: { control: 'select', options: ['online', 'offline', 'busy'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Fallback: Story = {}
