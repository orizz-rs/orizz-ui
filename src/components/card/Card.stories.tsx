import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Badge } from '../badge'
import { Card, CardContent, CardFooter, CardHeader } from './Card'

const meta = {
  title: 'Content/Card',
  component: Card,
  tags: ['autodocs'],
  args: { variant: 'outlined', padding: 'md' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outlined', 'elevated'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <strong>Design system</strong>
        <Badge tone="success">Active</Badge>
      </CardHeader>
      <CardContent>
        Shared components and tokens for every Orizz product.
      </CardContent>
      <CardFooter>
        <Button size="sm">Open project</Button>
        <Button size="sm" variant="ghost">Settings</Button>
      </CardFooter>
    </Card>
  ),
}
