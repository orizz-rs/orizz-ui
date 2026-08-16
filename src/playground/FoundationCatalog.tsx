import type { JSX } from 'react'
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Radio,
  Select,
  Spinner,
  Switch,
  Tabs,
  Textarea,
  type TabItem,
} from '../index'

const settingsTabs: readonly TabItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    content: 'Manage your public profile and organization details.',
  },
  {
    id: 'security',
    label: 'Security',
    content: 'Configure authentication and active sessions.',
  },
  {
    id: 'billing',
    label: 'Billing',
    content: 'Billing settings are available to workspace owners.',
    disabled: true,
  },
]

export function FoundationCatalog(): JSX.Element {
  return (
    <section className="section" aria-labelledby="foundation-title">
      <div className="section__heading">
        <div>
          <span className="eyebrow">Foundation catalog</span>
          <h2 id="foundation-title">Everything for the first screen</h2>
        </div>
        <Badge tone="success">14 components</Badge>
      </div>

      <div className="foundation-grid">
        <Card className="catalog-card catalog-card--wide" variant="outlined">
          <CardHeader>
            <div>
              <span className="component-label">Forms</span>
              <h3>Input and selection</h3>
            </div>
            <Badge tone="neutral">Native controls</Badge>
          </CardHeader>
          <CardContent className="form-catalog">
            <div className="form-catalog__fields">
              <Select label="Team role" defaultValue="member" fullWidth>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </Select>
              <Textarea
                label="Project notes"
                placeholder="Add context for your team"
                hint="Maximum 500 characters."
                fullWidth
              />
            </div>
            <div className="choice-catalog">
              <Checkbox
                label="Weekly summary"
                description="Receive progress every Monday."
                defaultChecked
              />
              <Divider decorative />
              <Radio
                name="catalog-plan"
                value="starter"
                label="Starter plan"
                description="For small teams and prototypes."
                defaultChecked
              />
              <Radio
                name="catalog-plan"
                value="professional"
                label="Professional plan"
                description="Advanced controls for growing teams."
              />
              <Divider decorative />
              <Switch
                label="Product analytics"
                description="Share anonymous usage data."
                defaultChecked
              />
            </div>
          </CardContent>
        </Card>

        <Card className="catalog-card" variant="outlined">
          <CardHeader>
            <div>
              <span className="component-label">Feedback</span>
              <h3>System messages</h3>
            </div>
          </CardHeader>
          <CardContent className="feedback-stack">
            <Alert tone="success" title="Changes saved">
              Your workspace settings are up to date.
            </Alert>
            <Alert tone="warning" title="Review access">
              Two invitations will expire tomorrow.
            </Alert>
            <div className="loading-row">
              <Spinner size="sm" label="Loading small" />
              <Spinner size="md" label="Loading medium" />
              <Spinner size="lg" label="Loading large" />
              <span>Loading states</span>
            </div>
          </CardContent>
        </Card>

        <Card className="catalog-card" variant="outlined">
          <CardHeader>
            <div>
              <span className="component-label">Content</span>
              <h3>Team card</h3>
            </div>
            <Avatar alt="Kong Suwan" fallback="KS" status="online" />
          </CardHeader>
          <CardContent>
            Keep identity, status, supporting text, and actions in one clear
            surface.
          </CardContent>
          <Divider decorative />
          <CardFooter>
            <Avatar alt="Design team" fallback="DS" size="sm" />
            <Avatar alt="Engineering team" fallback="EN" size="sm" status="busy" />
            <Badge tone="neutral">+8 members</Badge>
            <Button size="sm" variant="ghost">View team</Button>
          </CardFooter>
        </Card>

        <Card className="catalog-card catalog-card--wide" variant="outlined">
          <CardHeader>
            <div>
              <span className="component-label">Navigation</span>
              <h3>Workspace settings</h3>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs items={settingsTabs} ariaLabel="Workspace settings" />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
