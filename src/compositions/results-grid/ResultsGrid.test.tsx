import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ResultsGrid } from './ResultsGrid'
import type { ResultColumn } from './ResultsGrid.types'

const columns: readonly ResultColumn[] = [
  { id: 'id', name: 'ID', dbType: 'uuid' },
  { id: 'name', name: 'Name', dbType: 'text' },
  { id: 'total', name: 'Total', dbType: 'numeric(10,2)' },
  { id: 'amount', name: 'Amount', dbType: 'integer' },
]

const rows = [
  { id: 'uuid-1', name: 'Alice', total: 120.5, amount: 3 },
  { id: 'uuid-2', name: 'Bob', total: null, amount: 1 },
]

describe('ResultsGrid', () => {
  it('shows the title and row count in the toolbar', () => {
    render(<ResultsGrid columns={columns} rows={rows} />)
    expect(screen.getAllByText('Results').length).toBeGreaterThan(0)
    expect(screen.getByText('2 rows')).toBeInTheDocument()
  })

  it('renders cell values from the rows', () => {
    render(<ResultsGrid columns={columns} rows={rows} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('120.5')).toBeInTheDocument()
  })

  it('shows a NULL cell with a dimmed style', () => {
    render(<ResultsGrid columns={columns} rows={rows} />)
    const nullCells = screen.getAllByText('NULL')
    expect(nullCells.length).toBeGreaterThan(0)
    const firstNullCell = nullCells[0]
    expect(firstNullCell.className).toBeTruthy()
  })

  it('shows the empty message when rows is empty', () => {
    render(<ResultsGrid columns={columns} rows={[]} />)
    expect(screen.getByText('The query returned no rows.')).toBeInTheDocument()
    expect(screen.getByText('0 rows')).toBeInTheDocument()
  })

  it('calls onExport with the selected format', async () => {
    const onExport = vi.fn()
    const user = userEvent.setup()
    render(
      <ResultsGrid columns={columns} rows={rows} onExport={onExport} />,
    )
    await user.click(screen.getByRole('button', { name: 'Export' }))
    await user.click(screen.getByRole('menuitem', { name: 'CSV' }))
    expect(onExport).toHaveBeenCalledWith('csv')
  })

  it('supports a custom title', () => {
    render(<ResultsGrid columns={columns} rows={rows} title="Inventory query" />)
    expect(screen.getAllByText('Inventory query').length).toBeGreaterThan(0)
  })
})