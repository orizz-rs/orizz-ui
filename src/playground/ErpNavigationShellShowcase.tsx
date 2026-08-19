import { useState, type JSX } from 'react'
import { Boxes, LayoutDashboard, Settings, ShoppingCart, Users } from 'lucide-react'
import { Breadcrumb, Button, PageHeader, Sidebar, Toolbar, type SidebarItem } from '../index'

const navigationGroups = [{
  id: 'workspace',
  label: 'Workspace',
  items: [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
    { id: 'orders', label: 'Purchase orders', icon: <ShoppingCart /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes /> },
  ],
}, {
  id: 'admin',
  label: 'Administration',
  items: [{ id: 'members', label: 'Members', icon: <Users /> }, { id: 'settings', label: 'Settings', icon: <Settings /> }],
}]

export function ErpNavigationShellShowcase(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState('Overview')
  const groups = navigationGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      active: item.label === selected,
    })),
  }))

  return (
    <section className="section" aria-labelledby="erp-navigation-shell-title">
      <div className="section__heading"><div><span className="eyebrow">ERP navigation shell</span><h2 id="erp-navigation-shell-title">A consistent workspace frame.</h2></div><p>Sidebar, page header and toolbar compose the common ERP screen structure without coupling to routing or data fetching.</p></div>
      <div className="erp-shell-demo">
        <Sidebar groups={groups} collapsed={collapsed} onItemSelect={(item: SidebarItem) => setSelected(String(item.label))} />
        <div className="erp-shell-demo__content">
          <PageHeader eyebrow="Procurement" title={selected} description="Keep operational work discoverable and action-ready." breadcrumbs={<Breadcrumb items={[{ id: 'home', label: 'Workspace', href: '#workspace' }, { id: 'current', label: selected, current: true }]} />} actions={<><Button variant="secondary" size="sm" onClick={() => setCollapsed((value) => !value)}>{collapsed ? 'Expand menu' : 'Collapse menu'}</Button><Button size="sm">New order</Button></>} />
          <Toolbar className="erp-shell-demo__toolbar" start={<span className="erp-navigation-caption">6 purchase orders</span>} end={<><Button size="sm" variant="ghost">Filter</Button><Button size="sm" variant="secondary">Export</Button></>} />
        </div>
      </div>
    </section>
  )
}
