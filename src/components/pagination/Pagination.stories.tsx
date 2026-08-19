import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './Pagination'

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: {
    currentPage: 2,
    totalPages: 5,
    onPageChange: () => undefined,
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
