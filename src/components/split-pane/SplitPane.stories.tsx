import type { Meta, StoryObj } from '@storybook/react-vite'
import { SplitPane } from './SplitPane'

const meta = { title: 'Layout/SplitPane', component: SplitPane } satisfies Meta<typeof SplitPane>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { args: { first: <div>Purchase orders</div>, second: <div>Order details</div>, firstSize: '38%' } }
