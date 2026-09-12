import type { Meta } from '@storybook/react-vite'
import { useState, type JSX } from 'react'
import { Button } from '../../components/button'
import { ConnectionForm } from './ConnectionForm'

const meta = {
  title: 'Compositions/Database/ConnectionForm',
  component: ConnectionForm,
} satisfies Meta<typeof ConnectionForm>
export default meta

export function DefaultForm(): JSX.Element {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('No connection yet')
  return (
    <div>
      <Button onClick={() => setOpen(true)}>New connection…</Button>
      <ConnectionForm
        open={open}
        onOpenChange={setOpen}
        onTest={(values) => {
          setMessage(`Testing ${values.engine} at ${values.host}:${values.port}…`)
        }}
        onConnect={(values) => {
          setMessage(`Connected to ${values.name} (${values.engine})`)
        }}
      />
      <p>{message}</p>
    </div>
  )
}

export function PrefilledForm(): JSX.Element {
  const [open, setOpen] = useState(true)
  return (
    <ConnectionForm
      open={open}
      onOpenChange={setOpen}
      initialValues={{
        name: 'Production analytics',
        engine: 'postgresql',
        host: 'warehouse.acme.example',
        database: 'analytics',
        username: 'readonly',
      }}
    />
  )
}