import { useState, type JSX } from 'react'
import {
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
} from '../index'

type ApprovalState = 'pending' | 'approved' | 'rejected'
type TableMode = 'ready' | 'loading' | 'error'

interface PurchaseOrderRow {
  readonly id: string
  readonly order: string
  readonly supplier: string
  readonly status: ApprovalState
  readonly amount: number
}

const purchaseOrders: readonly PurchaseOrderRow[] = [
  { id: 'po-1001', order: 'PO-1001', supplier: 'Siam Industrial', status: 'pending', amount: 128000 },
  { id: 'po-1002', order: 'PO-1002', supplier: 'North Star Supply', status: 'approved', amount: 86500 },
  { id: 'po-1003', order: 'PO-1003', supplier: 'Metro Office', status: 'rejected', amount: 43200 },
  { id: 'po-1004', order: 'PO-1004', supplier: 'Siam Industrial', status: 'approved', amount: 219000 },
  { id: 'po-1005', order: 'PO-1005', supplier: 'Blue River Foods', status: 'pending', amount: 73500 },
  { id: 'po-1006', order: 'PO-1006', supplier: 'North Star Supply', status: 'approved', amount: 156000 },
]

const statusTone: Record<ApprovalState, 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

const purchaseOrderColumns: readonly DataTableColumn<PurchaseOrderRow>[] = [
  {
    id: 'order',
    header: 'Purchase order',
    accessor: 'order',
    sortable: true,
    filter: { type: 'text', placeholder: 'Search PO…' },
  },
  {
    id: 'supplier',
    header: 'Supplier',
    accessor: 'supplier',
    sortable: true,
    filter: { type: 'text', placeholder: 'Search suppliers…' },
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    filter: {
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
      ],
    },
    cell: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge>,
  },
  {
    id: 'amount',
    header: 'Amount',
    accessor: 'amount',
    align: 'end',
    sortable: true,
    cell: (row) => `฿${row.amount.toLocaleString('en-US')}`,
  },
]

export function EnterpriseDataTableShowcase(): JSX.Element {
  const [mode, setMode] = useState<TableMode>('ready')
  const [selectedRowIds, setSelectedRowIds] = useState<readonly string[]>([])
  const [message, setMessage] = useState('')

  const archiveSelected = (): void => {
    setMessage(`${selectedRowIds.length} purchase orders queued for archive.`)
    setSelectedRowIds([])
  }

  return (
    <section className="section" aria-labelledby="enterprise-table-title">
      <div className="section__heading">
        <div>
          <span className="eyebrow">Enterprise data</span>
          <h2 id="enterprise-table-title">ERP-ready table workflow</h2>
        </div>
        <p>
          Pagination, visible-row selection, bulk actions, filters, sorting and
          recoverable loading/error states in one typed table contract.
        </p>
      </div>
      <div className="showcase-card">
        <div className="enterprise-table-controls" aria-label="Table state controls">
          <Button
            size="sm"
            variant={mode === 'ready' ? 'primary' : 'secondary'}
            onClick={() => setMode('ready')}
          >
            Ready
          </Button>
          <Button
            size="sm"
            variant={mode === 'loading' ? 'primary' : 'secondary'}
            onClick={() => setMode('loading')}
          >
            Loading
          </Button>
          <Button
            size="sm"
            variant={mode === 'error' ? 'danger' : 'secondary'}
            onClick={() => setMode('error')}
          >
            Error
          </Button>
          {message ? <span className="enterprise-table-message" role="status">{message}</span> : null}
        </div>
        <DataTable
          columns={purchaseOrderColumns}
          data={purchaseOrders}
          getRowId={(row) => row.id}
          caption="Purchase orders"
          pageSizeOptions={[3, 6]}
          selectable
          selectedRowIds={selectedRowIds}
          onSelectionChange={setSelectedRowIds}
          selectionActions={
            <Button size="sm" variant="danger" onClick={archiveSelected}>
              Archive selected
            </Button>
          }
          loading={mode === 'loading'}
          error={mode === 'error' ? 'Purchase orders could not be refreshed.' : undefined}
          onRetry={() => {
            setMessage('Retry requested.')
            setMode('ready')
          }}
        />
      </div>
    </section>
  )
}
