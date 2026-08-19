import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'purchasing', label: 'Purchasing', href: '/purchasing' },
      { id: 'orders', label: 'Purchase orders' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithChevron: Story = {
  args: { separator: '›' },
}
