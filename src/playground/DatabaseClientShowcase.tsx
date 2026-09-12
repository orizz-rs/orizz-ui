import { useState, type JSX } from 'react'
import { Badge, Button } from '../index'
import { SplitPane } from '../components/split-pane'
import { Tabs } from '../components/tabs'
import { Toast } from '../components/toast'
import { SchemaTree, type DbNode } from '../compositions/schema-tree'
import { QueryEditor } from '../compositions/query-editor'
import { ResultsGrid, type ResultColumn } from '../compositions/results-grid'
import { ConnectionForm } from '../compositions/connection-form'

const catalog: readonly DbNode[] = [
  { id: 'catalog', name: 'shop_demo', type: 'catalog' },
]

async function loadSchemaChildren(node: DbNode): Promise<readonly DbNode[]> {
  if (node.type === 'catalog') {
    return [
      { id: 'public', name: 'public', type: 'schema' },
      { id: 'analytics', name: 'analytics', type: 'schema' },
    ]
  }
  if (node.type === 'schema') {
    return node.id === 'public'
      ? [
          { id: 't-customers', name: 'customers', type: 'table' },
          { id: 't-orders', name: 'orders', type: 'table' },
          { id: 'v-top-customers', name: 'top_customers', type: 'view' },
        ]
      : [{ id: 't-sales-facts', name: 'sales_facts', type: 'table' }]
  }
  if (node.type === 'table' || node.type === 'view') {
    const base: readonly DbNode[] = [
      { id: `${node.id}-id`, name: 'id', type: 'column', dataType: 'uuid', isPrimaryKey: true },
      { id: `${node.id}-name`, name: 'name', type: 'column', dataType: 'text' },
    ]
    return node.id === 't-orders'
      ? [...base, { id: `${node.id}-total`, name: 'total', type: 'column', dataType: 'numeric(12,2)', nullable: true }]
      : base
  }
  return []
}

const resultColumns: readonly ResultColumn[] = [
  { id: 'id', name: 'ID', dbType: 'uuid' },
  { id: 'name', name: 'Customer', dbType: 'text' },
  { id: 'total', name: 'Total', dbType: 'numeric(12,2)', nullable: true },
  { id: 'created_at', name: 'Created', dbType: 'timestamp' },
]

const mockRows = [
  {
    id: 'c-1001',
    name: 'Acme Corp',
    total: 12450.75,
    created_at: '2026-09-01T10:30:00.000Z',
  },
  {
    id: 'c-1002',
    name: 'Northstar Ltd',
    total: null,
    created_at: '2026-09-03T14:00:00.000Z',
  },
  {
    id: 'c-1003',
    name: 'Green Fields Co.',
    total: 890,
    created_at: '2026-09-05T09:15:00.000Z',
  },
]

const initialQuery = `-- Top customers by recent order total
SELECT
  c.name,
  ROUND(SUM(o.total), 2) AS total
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid'
GROUP BY c.name
ORDER BY total DESC
LIMIT 10;
`

export function DatabaseClientShowcase(): JSX.Element {
  const [query, setQuery] = useState(initialQuery)
  const [isRunning, setIsRunning] = useState(false)
  const [rows, setRows] = useState<readonly Record<string, unknown>[]>([])
  const [toastOpen, setToastOpen] = useState(false)
  const [connectionOpen, setConnectionOpen] = useState(false)
  const [runCount, setRunCount] = useState(0)

  const runQuery = (): void => {
    setIsRunning(true)
    window.setTimeout(() => {
      setIsRunning(false)
      setRows(mockRows)
      setRunCount((current) => current + 1)
      setToastOpen(true)
      window.setTimeout(() => setToastOpen(false), 2500)
    }, 700)
  }

  return (
    <section className="section" aria-labelledby="db-client-title">
      <div className="section__heading">
        <div>
          <span className="eyebrow">Database client</span>
          <h2 id="db-client-title">Browse, query, and inspect results</h2>
        </div>
        <Badge tone="brand">4 compositions</Badge>
      </div>

      <div className="showcase-card showcase-card--wide">
        <header className="showcase-card__header">
          <div>
            <h3>SchemaTree + QueryEditor + ResultsGrid</h3>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setConnectionOpen(true)}>
            New connection…
          </Button>
        </header>

        <SplitPane
          orientation="horizontal"
          firstSize="28%"
          gap="sm"
          first={
            <div className="db-client-sidebar">
              <SchemaTree
                items={catalog}
                loadChildren={loadSchemaChildren}
                ariaLabel="Shop database schema"
              />
            </div>
          }
          second={
            <div className="db-client-main">
              <Tabs
                ariaLabel="Query workspace"
                items={[
                  {
                    id: 'query',
                    label: `Query${runCount > 0 ? ` · ${runCount}` : ''}`,
                    content: (
                      <QueryEditor
                        label="SQL query"
                        value={query}
                        onValueChange={setQuery}
                        isRunning={isRunning}
                        onRun={runQuery}
                        onCancel={() => setIsRunning(false)}
                        height="14rem"
                      />
                    ),
                  },
                ]}
              />
              <ResultsGrid
                columns={resultColumns}
                rows={rows}
                title="Query results"
                onExport={(format) => {
                  window.alert(
                    `Exporting ${format} is handled by the hosting application.`,
                  )
                }}
              />
            </div>
          }
        />
      </div>

      <ConnectionForm
        open={connectionOpen}
        onOpenChange={setConnectionOpen}
        onTest={(values) => {
          window.alert(`Testing ${values.engine} at ${values.host}:${values.port}`)
        }}
        onConnect={(values) => {
          setConnectionOpen(false)
          window.alert(`Connected to ${values.name}`)
        }}
      />

      <Toast
        open={toastOpen}
        tone="success"
        title="Query executed"
        onDismiss={() => setToastOpen(false)}
      >
        Returned {mockRows.length} rows
      </Toast>
    </section>
  )
}