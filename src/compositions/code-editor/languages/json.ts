import { rule, wordRule } from './rules'
import type { LanguageDefinition } from './types'

export const jsonLanguage: LanguageDefinition = {
  id: 'json',
  label: 'JSON',
  extensions: ['.json', '.jsonc', '.json5'],
  blockCommentTokens: ['/*', '*/'],
  indentAfterTokens: ['{', '['],
  indentUnit: '  ',
  rules: [
    rule('property', String.raw`"(?:\\.|[^"\\])*"(?=\s*:)`),
    rule('string', String.raw`"(?:\\.|[^"\\])*"`),
    rule('comment', String.raw`//[^\n]*`),
    rule('comment', String.raw`/\*[\s\S]*?\*/`),
    rule('number', String.raw`-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?`),
    wordRule('literal', ['true', 'false', 'null']),
    rule('punctuation', String.raw`[{}[\],:]`),
  ],
}
