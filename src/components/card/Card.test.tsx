import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardFooter, CardHeader } from './Card'

describe('Card', () => {
  it('composes header, content, and footer sections', () => {
    render(
      <Card>
        <CardHeader>Workspace</CardHeader>
        <CardContent>Manage your workspace.</CardContent>
        <CardFooter>Footer action</CardFooter>
      </Card>,
    )

    expect(screen.getByText('Workspace')).toBeVisible()
    expect(screen.getByText('Manage your workspace.')).toBeVisible()
    expect(screen.getByText('Footer action')).toBeVisible()
  })
})
