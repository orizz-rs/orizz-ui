import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  args: { variant: 'text', size: 'md' },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {}
export const Card: Story = { args: { variant: 'rect', size: 'lg' } }
export const Avatar: Story = { args: { variant: 'circle' } }
