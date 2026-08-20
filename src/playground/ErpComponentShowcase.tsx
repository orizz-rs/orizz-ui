import { useState, type JSX } from 'react'
import {
  Badge,
  Button,
  Combobox,
  CurrencyInput,
  DatePicker,
  Dialog,
  FormField,
  MultiSelect,
  NumberInput,
  PercentageInput,
  Popover,
  QuantityInput,
  TimeInput,
} from '../index'

const warehouseOptions = [
  { value: 'bkk', label: 'Bangkok warehouse', description: 'WH-BKK · 1,240 items' },
  { value: 'cnx', label: 'Chiang Mai warehouse', description: 'WH-CNX · 680 items' },
  { value: 'hdy', label: 'Hat Yai warehouse', description: 'WH-HDY · 420 items' },
] as const

const teamOptions = [
  { value: 'finance', label: 'Finance', description: 'Invoices and reporting' },
  { value: 'operations', label: 'Operations', description: 'Orders and fulfillment' },
  { value: 'people', label: 'People', description: 'Team and permissions' },
] as const

export function ErpComponentShowcase(): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [teams, setTeams] = useState<readonly string[]>(['finance'])

  return (
    <section className="section" aria-labelledby="erp-components-title">
      <div className="section__heading">
        <div>
          <span className="eyebrow">ERP foundation</span>
          <h2 id="erp-components-title">New components for ERP workflows</h2>
        </div>
        <Badge tone="brand">11 new components</Badge>
      </div>

      <div className="erp-showcase-grid">
        <article className="showcase-card">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Forms</span>
              <h3>Amount and warehouse inputs</h3>
            </div>
          </header>
          <div className="erp-showcase-form">
            <NumberInput
              label="Quantity"
              defaultValue={12}
              min={0}
              step={1}
              hint="Native number input with parsed value callback."
            />
            <CurrencyInput
              label="Unit price"
              currency="THB"
              defaultValue={1250}
              min={0}
              step={0.01}
            />
            <Combobox
              label="Warehouse"
              options={warehouseOptions}
              placeholder="Search warehouse…"
              fullWidth
            />
          </div>
        </article>

        <article className="showcase-card">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Transaction values</span>
              <h3>Quantity, percentage, and time</h3>
            </div>
          </header>
          <div className="erp-showcase-form">
            <QuantityInput label="Ordered quantity" unit="kg" defaultValue={12.5} min={0} step={0.01} />
            <PercentageInput label="Tax rate" defaultValue={7} min={0} max={100} step={0.01} />
            <TimeInput label="Requested delivery time" defaultValue="09:30" />
          </div>
        </article>

        <article className="showcase-card">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Field primitive</span>
              <h3>Shared form contract</h3>
            </div>
          </header>
          <FormField
            label="Purchase order note"
            htmlFor="erp-note"
            required
            hint="Reusable label, required marker, hint and error layout."
          >
            <input
              id="erp-note"
              className="showcase-native-input"
              placeholder="Add a note for approvers"
              aria-describedby="erp-note-message"
            />
          </FormField>
        </article>

        <article className="showcase-card">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">ERP form controls</span>
              <h3>Date and team selection</h3>
            </div>
          </header>
          <div className="erp-showcase-form">
            <DatePicker
              label="Requested delivery"
              defaultValue="2026-08-20"
              hint="Uses the user's browser and locale date picker."
            />
            <MultiSelect
              label="Responsible teams"
              options={teamOptions}
              value={teams}
              onValueChange={setTeams}
              fullWidth
            />
          </div>
        </article>

        <article className="showcase-card showcase-card--wide">
          <header className="showcase-card__header">
            <div>
              <span className="component-label">Overlay primitives</span>
              <h3>Dialog and Popover</h3>
            </div>
            <code>portal · Escape · click outside</code>
          </header>
          <div className="erp-showcase-actions">
            <Button onClick={() => setDialogOpen(true)}>Open confirmation dialog</Button>
            <Popover
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
              trigger={<Button variant="secondary">Open filter popover</Button>}
              title="Filter status"
            >
              <label className="erp-showcase-select-label">
                Status
                <select defaultValue="all">
                  <option value="all">All statuses</option>
                  <option value="pending">Pending approval</option>
                  <option value="approved">Approved</option>
                </select>
              </label>
            </Popover>
            <span className="erp-showcase-note">
              Overlay content is rendered outside clipping containers.
            </span>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Submit purchase order?"
            description="The order will move to the approval workflow."
          >
            <div className="erp-showcase-actions">
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Submit order</Button>
            </div>
          </Dialog>
        </article>
      </div>
    </section>
  )
}
