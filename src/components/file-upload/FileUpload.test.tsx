import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FileUpload } from './FileUpload'

describe('FileUpload', () => {
  it('reports selected files and displays them', async () => {
    const user = userEvent.setup()
    const onFilesChange = vi.fn()
    render(<FileUpload label="Attachments" onFilesChange={onFilesChange} />)
    const file = new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' })
    await user.upload(screen.getByLabelText('Attachments'), file)
    expect(onFilesChange).toHaveBeenCalledWith([file])
    expect(screen.getByText('invoice.pdf')).toBeInTheDocument()
  })

  it('removes a selected file', async () => {
    const user = userEvent.setup()
    const file = new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' })
    render(<FileUpload label="Attachments" defaultFiles={[file]} />)
    await user.click(screen.getByRole('button', { name: 'Remove invoice.pdf' }))
    expect(screen.queryByText('invoice.pdf')).not.toBeInTheDocument()
  })
})
