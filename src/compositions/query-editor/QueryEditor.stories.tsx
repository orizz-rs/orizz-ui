import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type JSX } from 'react'
import { QueryEditor } from './QueryEditor'

const meta = {
  title: 'Compositions/Database/QueryEditor',
  component: QueryEditor,
} satisfies Meta<typeof QueryEditor>
export default meta
type Story = StoryObj<typeof meta>

const SAMPLE_SQL = `-- Top customers by lifetime value
SELECT
  c.id,
  c.name,
  ROUND(SUM(o.total)) AS lifetime_value
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid'
GROUP BY c.id, c.name
ORDER BY lifetime_value DESC
LIMIT 10;
`

export const Default: Story = {
  args: { defaultValue: SAMPLE_SQL, height: '20rem' },
}

export function WithRunFeedback(): JSX.Element {
  const [isRunning, setIsRunning] = useState(false)
  const [message, setMessage] = useState('Ready')
  return (
    <div>
      <QueryEditor
        defaultValue={SAMPLE_SQL}
        isRunning={isRunning}
        onRun={(sql) => {
          setIsRunning(true)
          window.setTimeout(() => {
            setIsRunning(false)
            setMessage(`Executed ${splitCount(sql)} statement(s)`)
          }, 900)
        }}
        onCancel={() => {
          setIsRunning(false)
          setMessage('Query cancelled')
        }}
        height="20rem"
      />
      <p>{message}</p>
    </div>
  )
}

function splitCount(sql: string): number {
  const chunks = sql.split(';')
  return chunks.filter((chunk) => chunk.trim().length > 0).length
}