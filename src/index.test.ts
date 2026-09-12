import { describe, expect, it } from 'vitest'
import {
  Button,
  ConnectionForm,
  DataTable,
  QueryEditor,
  ResultsGrid,
  SchemaTree,
  TreeView,
} from './index'

describe('public package API', () => {
  it('keeps primitives and compositions available from the package root', () => {
    expect(Button).toBeTypeOf('object')
    expect(DataTable).toBeTypeOf('function')
    expect(TreeView).toBeTypeOf('function')
    expect(SchemaTree).toBeTypeOf('function')
    expect(QueryEditor).toBeTypeOf('function')
    expect(ResultsGrid).toBeTypeOf('function')
    expect(ConnectionForm).toBeTypeOf('function')
  })
})
