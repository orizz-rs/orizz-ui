import { describe, expect, it } from 'vitest'
import { Button, DataTable } from './index'

describe('public package API', () => {
  it('keeps primitives and compositions available from the package root', () => {
    expect(Button).toBeTypeOf('object')
    expect(DataTable).toBeTypeOf('function')
  })
})
