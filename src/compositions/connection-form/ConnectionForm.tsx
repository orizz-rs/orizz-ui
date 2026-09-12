import {
  useCallback,
  useState,
  type ChangeEventHandler,
  type FormEvent,
  type JSX,
  type ReactNode,
} from 'react'
import { Button } from '../../components/button'
import { Checkbox } from '../../components/checkbox'
import { Dialog } from '../../components/dialog'
import { Fieldset } from '../../components/fieldset'
import { Form, FormActions } from '../../components/form'
import { Select } from '../../components/select'
import { TextField } from '../../components/text-field'
import {
  createConnectionValues,
  DB_ENGINE_LABELS,
  DB_ENGINES,
  DEFAULT_PORTS,
  type ConnectionValues,
  type DbEngine,
} from './connection.types'
import styles from './ConnectionForm.module.css'

export interface ConnectionFormProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly initialValues?: Partial<ConnectionValues>
  readonly isTesting?: boolean
  readonly isConnecting?: boolean
  /** Global error shown at the top of the form (e.g. network failure). */
  readonly error?: ReactNode
  readonly onTest?: (values: ConnectionValues) => void
  readonly onConnect?: (values: ConnectionValues) => void
}

export function ConnectionForm({
  open,
  onOpenChange,
  initialValues,
  isTesting = false,
  isConnecting = false,
  error,
  onTest,
  onConnect,
}: ConnectionFormProps): JSX.Element {
  const [values, setValues] = useState<ConnectionValues>(() =>
    createConnectionValues(initialValues),
  )
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ConnectionValues, string>>
  >({})
  const [submitted, setSubmitted] = useState(false)

  const handleOpenChange = useCallback(
    (nextOpen: boolean): void => {
      if (!nextOpen) setSubmitted(false)
      onOpenChange(nextOpen)
    },
    [onOpenChange],
  )

  const update = (
    key: keyof ConnectionValues,
  ): ChangeEventHandler<HTMLInputElement> => {
    return (event): void => {
      const nextValue =
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
      setValues((previous) => ({ ...previous, [key]: nextValue }))
    }
  }

  const updateSelect = (
    key: keyof ConnectionValues,
  ): ChangeEventHandler<HTMLSelectElement> => {
    return (event): void => {
      const nextEngine = event.target.value as DbEngine
      setValues((previous) => ({
        ...previous,
        [key]: nextEngine,
        port: previous.port === '' || DEFAULT_PORTS[previous.engine] === previous.port
          ? DEFAULT_PORTS[nextEngine]
          : previous.port,
      }))
    }
  }

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ConnectionValues, string>> = {}
    if (values.name.trim() === '') errors.name = 'Connection name is required.'
    if (values.host.trim() === '') errors.host = 'Host is required.'
    if (values.port.trim() !== '' && !/^\d{1,5}$/.test(values.port.trim())) {
      errors.port = 'Port must be a number (1–65535).'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleTest = (): void => {
    if (!validate()) return
    onTest?.(values)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (!validate()) return
    setSubmitted(true)
    onConnect?.(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="New database connection"
      description="Provide the details to reach your database server."
    >
      <Form
        aria-label="Database connection form"
        error={error}
        isSubmitting={isConnecting || isTesting}
        onSubmit={handleSubmit}
      >
        <Fieldset legend="General">
          <TextField
            label="Connection name"
            placeholder="e.g. Production database"
            value={values.name}
            onChange={update('name')}
            error={fieldErrors.name}
            fullWidth
          />
          <Select
            label="Engine"
            value={values.engine}
            onChange={updateSelect('engine')}
            fullWidth
          >
            {DB_ENGINES.map((engine) => (
              <option key={engine} value={engine}>
                {DB_ENGINE_LABELS[engine]}
              </option>
            ))}
          </Select>
        </Fieldset>

        <Fieldset legend="Server">
          <TextField
            label="Host"
            placeholder="db.example.com"
            value={values.host}
            onChange={update('host')}
            error={fieldErrors.host}
            fullWidth
          />
          <TextField
            label="Port"
            placeholder={DEFAULT_PORTS[values.engine]}
            value={values.port}
            onChange={update('port')}
            error={fieldErrors.port}
            inputMode="numeric"
          />
          <TextField
            label="Database"
            value={values.database}
            onChange={update('database')}
            fullWidth
          />
          <Checkbox
            label="Use SSL/TLS"
            checked={values.ssl}
            onChange={update('ssl')}
          />
        </Fieldset>

        <Fieldset legend="Authentication">
          <TextField
            label="Username"
            value={values.username}
            onChange={update('username')}
            autoComplete="username"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={values.password}
            onChange={update('password')}
            autoComplete="current-password"
            fullWidth
          />
        </Fieldset>

        <FormActions align="between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <div className={styles.submitActions}>
            <Button
              type="button"
              variant="secondary"
              isLoading={isTesting}
              onClick={handleTest}
            >
              Test connection
            </Button>
            <Button type="submit" isLoading={isConnecting && submitted}>
              Connect
            </Button>
          </div>
        </FormActions>
      </Form>
    </Dialog>
  )
}