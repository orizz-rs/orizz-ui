import { useState, type JSX } from 'react'
import { AlertTriangle, Check, RefreshCw } from 'lucide-react'
import { Button, LoadingOverlay, ResultState, Timeline } from '../index'

export function ErpFeedbackWorkflowShowcase(): JSX.Element {
  const [loading, setLoading] = useState(false)
  return <section className="section" aria-labelledby="erp-feedback-workflow-title">
    <div className="section__heading"><div><span className="eyebrow">ERP feedback workflow</span><h2 id="erp-feedback-workflow-title">Explain what happened next.</h2></div><p>Feedback patterns help ERP users understand empty, loading, success and audit states without losing context.</p></div>
    <div className="erp-feedback-grid">
      <ResultState tone="success" icon={<Check size={18} />} title="Purchase order approved" description="PO-1004 is ready for supplier confirmation." action={<Button size="sm">Open order</Button>} />
      <LoadingOverlay open={loading} label="Refreshing orders"><div className="erp-loading-card"><span className="component-label">Live data</span><strong>6 purchase orders</strong><Button size="sm" variant="secondary" onClick={() => setLoading((value) => !value)}>{loading ? 'Stop loading' : 'Refresh data'}</Button></div></LoadingOverlay>
      <div className="erp-feedback-card"><span className="component-label">Approval history</span><Timeline items={[{ id: 'created', title: 'Order created', description: 'Niran Chai submitted PO-1004.', timestamp: '09:30' }, { id: 'approved', title: 'Approved by finance', timestamp: '10:15', tone: 'success' }, { id: 'queued', title: 'Queued for supplier', timestamp: '10:20', tone: 'warning' }]} /></div>
      <ResultState tone="warning" icon={<AlertTriangle size={18} />} title="No matching orders" description="Try adjusting your filters or create a new order." action={<Button variant="secondary" size="sm"><RefreshCw size={14} /> Clear filters</Button>} />
    </div>
  </section>
}
