import { FileText } from 'lucide-react'
import { useState, type JSX } from 'react'
import {
  Breadcrumb,
  Button,
  EmptyState,
  Pagination,
  Progress,
  Skeleton,
  Toast,
} from '../index'

const breadcrumbItems = [
  { id: 'home', label: 'Home', href: '#top' },
  { id: 'purchasing', label: 'Purchasing', href: '#enterprise-table-title' },
  { id: 'orders', label: 'Purchase orders' },
] as const

export function ErpNavigationFeedbackShowcase(): JSX.Element {
  const [page, setPage] = useState(2)
  const [toastOpen, setToastOpen] = useState(false)
  const [progress, setProgress] = useState(65)

  const increaseProgress = (): void => {
    setProgress((current) => (current >= 100 ? 0 : current + 10))
  }

  return (
    <section className="section" aria-labelledby="erp-navigation-title">
      <div className="section__heading">
        <div>
          <span className="eyebrow">Navigation and feedback</span>
          <h2 id="erp-navigation-title">Keep ERP workflows clear</h2>
        </div>
        <p>
          Navigation context, recoverable states and progress feedback are ready
          to reuse across purchasing, inventory and finance screens.
        </p>
      </div>

      <div className="erp-navigation-grid">
        <article className="showcase-card">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Navigation</span>
              <h3>Breadcrumb and pagination</h3>
            </div>
          </header>
          <div className="erp-navigation-stack">
            <Breadcrumb items={breadcrumbItems} separator="›" />
            <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
            <span className="erp-navigation-caption">Current page: {page}</span>
          </div>
        </article>

        <article className="showcase-card">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Feedback</span>
              <h3>Toast and progress</h3>
            </div>
          </header>
          <div className="erp-navigation-stack">
            <div className="erp-navigation-actions">
              <Button size="sm" onClick={() => setToastOpen(true)}>Show success toast</Button>
              <Button size="sm" variant="secondary" onClick={increaseProgress}>Advance progress</Button>
            </div>
            <Progress label="Approval workflow" value={progress} />
          </div>
          <Toast
            open={toastOpen}
            tone="success"
            title="Purchase order saved"
            onDismiss={() => setToastOpen(false)}
          >
            The order is waiting for approval.
          </Toast>
        </article>

        <article className="showcase-card">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Loading</span>
              <h3>Skeleton states</h3>
            </div>
          </header>
          <div className="erp-skeleton-stack">
            <Skeleton size="lg" label="Loading purchase order title" />
            <Skeleton label="Loading purchase order description" />
            <Skeleton variant="rect" label="Loading purchase order summary" />
          </div>
        </article>

        <article className="showcase-card">
          <EmptyState
            title="No draft purchase orders"
            description="Create a purchase order to start the approval workflow."
            icon={<FileText />}
            action={<Button size="sm">Create purchase order</Button>}
          />
        </article>
      </div>
    </section>
  )
}
