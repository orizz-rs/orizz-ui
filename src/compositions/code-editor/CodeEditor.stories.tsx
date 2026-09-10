import { useState, type JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CodeEditor } from './CodeEditor'
import { rule, wordRule, type LanguageDefinition } from './languages'

const meta = { title: 'Editors/CodeEditor', component: CodeEditor, tags: ['autodocs'] } satisfies Meta<typeof CodeEditor>
export default meta
type Story = StoryObj<typeof meta>

const TYPESCRIPT_SAMPLE = [
  '// Effective unit price for an order line, after quantity discount.',
  'export function unitPrice(line: OrderLine): number {',
  '  const discount = line.quantity >= 10 ? 0.05 : 0',
  '  return round(line.price * (1 - discount))',
  '}',
].join('\n')

const PYTHON_SAMPLE = [
  '# Sum the outstanding balance of unpaid invoices.',
  'def outstanding_balance(invoices: list[Invoice]) -> Decimal:',
  '    total = Decimal("0")',
  '    for invoice in invoices:',
  '        if not invoice.paid:',
  '            total += invoice.amount',
  '    return total',
].join('\n')

const RUST_SAMPLE = [
  '// Reject an approval request when it is missing a required checker.',
  'pub fn validate(request: &ApprovalRequest) -> Result<(), Reject> {',
  '    match request.checker {',
  '        Some(_) => Ok(()),',
  '        None => Err(Reject::MissingChecker),',
  '    }',
  '}',
].join('\n')

const SQL_SAMPLE = [
  '-- Open purchase orders per supplier.',
  'SELECT supplier_id, COUNT(*) AS order_count',
  'FROM purchase_order',
  'WHERE status = \'open\'',
  'GROUP BY supplier_id',
  'ORDER BY order_count DESC',
].join('\n')

export const TypeScript: Story = {
  args: { label: 'Pricing rule', fileName: 'pricing-rule.ts', defaultValue: TYPESCRIPT_SAMPLE },
}

export const Python: Story = {
  args: { label: 'Invoice export', fileName: 'outstanding_balance.py', defaultValue: PYTHON_SAMPLE },
}

export const Rust: Story = {
  args: { label: 'Approval service', fileName: 'validate.rs', defaultValue: RUST_SAMPLE },
}

export const AutoDetect: Story = {
  args: { label: 'Supplier report', fileName: 'supplier-report.sql', defaultValue: SQL_SAMPLE },
}

export const ReadOnly: Story = {
  args: { label: 'Locked formula', defaultValue: TYPESCRIPT_SAMPLE, language: 'typescript', readOnly: true },
}

export function LanguagePicker(): JSX.Element {
  const [language, setLanguage] = useState('typescript')
  return (
    <CodeEditor
      label="Pricing rule"
      language={language}
      onLanguageChange={setLanguage}
      defaultValue={TYPESCRIPT_SAMPLE}
      height="28rem"
    />
  )
}

/** Applications can define their own LanguageDefinition and pass it directly. */
const ORIZZ_EXPRESSION: LanguageDefinition = {
  id: 'orizz-expression',
  label: 'Orizz expression',
  extensions: ['.orizz'],
  lineCommentToken: '#',
  indentAfterTokens: ['{'],
  rules: [
    rule('comment', String.raw`#[^\n]*`),
    wordRule('keyword', ['if', 'then', 'else', 'and', 'or', 'not']),
    rule('property', String.raw`@[A-Za-z_]\w*`),
    rule('number', String.raw`\d+(?:\.\d+)?`),
    rule('operator', String.raw`[=<>+\-*/%!]+`),
  ],
}

export function CustomLanguage(): JSX.Element {
  return (
    <CodeEditor
      label="Approval condition"
      language={ORIZZ_EXPRESSION}
      defaultValue={'# Fields come from the approval document.\n@if(amount > @limit and @checked) { approve }'}
    />
  )
}
