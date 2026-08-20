import { useState, type FormEvent, type JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { TextField } from '../text-field'
import { Form, FormActions } from './Form'

const meta = { title: 'Forms/Form', component: Form, tags: ['autodocs'] } satisfies Meta<typeof Form>
export default meta
type Story = StoryObj<typeof meta>

export function Default(): JSX.Element {
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <Form onSubmit={handleSubmit} error={submitted ? 'Example form submitted.' : undefined}>
      <TextField label="Project name" required />
      <FormActions><Button type="submit">Save project</Button></FormActions>
    </Form>
  )
}

export const Submitting: Story = {
  args: {
    isSubmitting: true,
    children: <FormActions><Button isLoading>Saving project</Button></FormActions>,
  },
}
