import { useState, type JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileUpload } from './FileUpload'

const meta = { title: 'Forms/FileUpload', component: FileUpload, tags: ['autodocs'], args: { label: 'Attachments', hint: 'Upload invoices or supporting documents.' } } satisfies Meta<typeof FileUpload>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Multiple: Story = { args: { multiple: true, accept: '.pdf,.xlsx', maxFiles: 3 } }
export const Error: Story = { args: { error: 'Attach at least one invoice.' } }

export function Controlled(): JSX.Element {
  const [files, setFiles] = useState<readonly File[]>([])
  return <FileUpload label="Attachments" files={files} multiple onFilesChange={setFiles} />
}
