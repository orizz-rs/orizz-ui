import { rule, wordRule } from './rules'
import type { LanguageDefinition } from './types'

export const javascriptLanguage: LanguageDefinition = {
  id: 'javascript',
  label: 'JavaScript',
  extensions: ['.js', '.jsx', '.mjs', '.cjs'],
  lineCommentToken: '//',
  blockCommentTokens: ['/*', '*/'],
  indentAfterTokens: ['{', '(', '['],
  indentUnit: '  ',
  rules: [
    rule('comment', String.raw`//[^\n]*`),
    rule('comment', String.raw`/\*[\s\S]*?\*/`),
    rule('string', String.raw`"(?:\\.|[^"\\\n])*"`),
    rule('string', String.raw`'(?:\\.|[^'\\\n])*'`),
    rule('string', '`(?:\\\\.|[^`\\\\])*`'),
    rule(
      'number',
      String.raw`0[xX][\da-fA-F]+n?|0[bB][01]+n?|0[oO][0-7]+n?|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?n?`,
    ),
    wordRule('literal', ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']),
    wordRule('keyword', [
      'as', 'async', 'await', 'break', 'case', 'catch', 'class', 'const',
      'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum',
      'export', 'extends', 'finally', 'for', 'from', 'function', 'get', 'if',
      'implements', 'import', 'in', 'instanceof', 'let', 'new', 'of', 'set',
      'static', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
      'void', 'while', 'with', 'yield',
    ]),
    wordRule('type', [
      'Array', 'BigInt', 'Boolean', 'Date', 'Error', 'Function', 'JSON',
      'Map', 'Math', 'Number', 'Object', 'Promise', 'RegExp', 'Set',
      'String', 'Symbol', 'WeakMap', 'WeakSet', 'console',
    ]),
    rule('function', String.raw`\b[A-Za-z_$][\w$]*(?=\s*\()`),
    rule('operator', String.raw`=>|[+\-*/%=<>!&|^~?]+`),
    rule('punctuation', String.raw`[{}()[\];,.:]`),
  ],
}
