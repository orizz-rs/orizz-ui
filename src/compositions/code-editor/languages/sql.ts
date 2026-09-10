import { rule, wordRule } from './rules'
import type { LanguageDefinition } from './types'

const KEYWORDS = [
  'add', 'all', 'alter', 'and', 'as', 'asc', 'begin', 'between', 'by', 'case',
  'cascade', 'check', 'commit', 'constraint', 'create', 'cross', 'default',
  'delete', 'desc', 'distinct', 'drop', 'else', 'end', 'exists', 'foreign',
  'from', 'full', 'group', 'having', 'in', 'index', 'inner', 'insert', 'into',
  'is', 'join', 'key', 'left', 'like', 'limit', 'not', 'null', 'offset', 'on',
  'or', 'order', 'outer', 'primary', 'references', 'right', 'rollback',
  'select', 'set', 'table', 'then', 'transaction', 'union', 'unique',
  'update', 'values', 'view', 'when', 'where',
]

const TYPES = [
  'bigint', 'blob', 'boolean', 'char', 'date', 'decimal', 'float', 'int',
  'integer', 'json', 'jsonb', 'numeric', 'real', 'serial', 'smallint',
  'text', 'timestamp', 'uuid', 'varchar',
]

export const sqlLanguage: LanguageDefinition = {
  id: 'sql',
  label: 'SQL',
  extensions: ['.sql'],
  lineCommentToken: '--',
  blockCommentTokens: ['/*', '*/'],
  indentAfterTokens: ['('],
  indentUnit: '  ',
  rules: [
    rule('comment', String.raw`--[^\n]*`),
    rule('comment', String.raw`/\*[\s\S]*?\*/`),
    rule('string', String.raw`'(?:[^']|'')*'`),
    rule('number', String.raw`\d+(?:\.\d+)?`),
    wordRule('keyword', KEYWORDS, 'i'),
    wordRule('type', TYPES, 'i'),
    rule('function', String.raw`\b[A-Za-z_]\w*(?=\s*\()`),
    rule('operator', String.raw`<>|!=|[=<>+\-*/%|]+`),
    rule('punctuation', String.raw`[{}()[\];,.]`),
  ],
}
