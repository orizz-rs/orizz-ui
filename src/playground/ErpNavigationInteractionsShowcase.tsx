import { useState, type JSX } from 'react'
import { Accordion, Button, NavigationMenu, type NavigationMenuItem } from '../index'

export function ErpNavigationInteractionsShowcase(): JSX.Element {
  const [active, setActive] = useState('Overview')
  return <section className="section" aria-labelledby="erp-navigation-interactions-title">
    <div className="section__heading"><div><span className="eyebrow">ERP navigation interactions</span><h2 id="erp-navigation-interactions-title">Keep dense workflows scannable.</h2></div><p>NavigationMenu and Accordion provide predictable wayfinding and progressive disclosure for ERP screens.</p></div>
    <div className="erp-interactions-grid">
      <div><span className="component-label">NavigationMenu</span><NavigationMenu items={['Overview', 'Purchase orders', 'Reports'].map((label) => ({ id: label.toLowerCase().replaceAll(' ', '-'), label, active: label === active }))} onItemSelect={(item: NavigationMenuItem) => setActive(String(item.label))} /><p className="erp-navigation-caption">Current section: {active}</p></div>
      <div><span className="component-label">Accordion</span><Accordion items={[{ id: 'approval', title: 'Approval workflow', content: 'Pending orders are routed to the assigned approver.' }, { id: 'audit', title: 'Audit information', content: 'Changes are recorded with actor and timestamp.' }]} /><Button className="erp-accordion-action" variant="ghost" size="sm">View audit log →</Button></div>
    </div>
  </section>
}
