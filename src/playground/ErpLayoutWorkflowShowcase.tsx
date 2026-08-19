import { useState, type JSX } from 'react'
import { Button, SplitPane, Stepper } from '../index'

const workflowSteps = [{ id: 'draft', label: 'Draft', description: 'Prepare request', status: 'complete' as const }, { id: 'review', label: 'Review', description: 'Check details' }, { id: 'approve', label: 'Approval', description: 'Assign approver' }]

export function ErpLayoutWorkflowShowcase(): JSX.Element {
  const [step, setStep] = useState('review')
  return <section className="section" aria-labelledby="erp-layout-workflow-title">
    <div className="section__heading"><div><span className="eyebrow">ERP layout & workflow</span><h2 id="erp-layout-workflow-title">Make context and progress visible.</h2></div><p>SplitPane supports list/detail screens while Stepper communicates transaction progress.</p></div>
    <div className="erp-workflow-demo"><Stepper current={step} onStepChange={setStep} items={workflowSteps} /><SplitPane first={<div className="erp-workflow-pane"><span className="component-label">Purchase orders</span><strong>PO-1004</strong><span className="erp-navigation-caption">Siam Industrial · ฿219,000</span></div>} second={<div className="erp-workflow-pane"><span className="component-label">Current step</span><h3>{workflowSteps.find((item) => item.id === step)?.label}</h3><p>Review the order details before continuing.</p><Button size="sm">Continue</Button></div>} /></div>
  </section>
}
