import { rule, wordRule } from './rules'
import type { LanguageDefinition } from './types'

export const pythonLanguage: LanguageDefinition = {
  id: 'python',
  label: 'Python',
  extensions: ['.py', '.pyi'],
  lineCommentToken: '#',
  indentAfterTokens: [':'],
  indentUnit: '    ',
  rules: [
    rule('comment', String.raw`#[^\n]*`),
    rule('string', String.raw`[rRbBuU]{0,2}"""[\s\S]*?"""`),
    rule('string', String.raw`[rRbBuU]{0,2}'''[\s\S]*?'''`),
    rule('string', String.raw`[rRbBuU]{0,2}"(?:\\.|[^"\\\n])*"`),
    rule('string', String.raw`[rRbBuU]{0,2}'(?:\\.|[^'\\\n])*'`),
    rule('function', String.raw`@[\w.]+`),
    rule(
      'number',
      String.raw`0[xX][\da-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?[jJ]?`,
    ),
    wordRule('literal', ['True', 'False', 'None']),
    wordRule('keyword', [
      'and', 'as', 'assert', 'async', 'await', 'break', 'case', 'class',
      'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for',
      'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'match',
      'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
      'with', 'yield',
    ]),
    wordRule('type', [
      'bool', 'bytes', 'dict', 'float', 'frozenset', 'int', 'list', 'object',
      'set', 'str', 'tuple', 'type',
    ]),
    wordRule('literal', ['self', 'cls']),
    rule('function', String.raw`\b[A-Za-z_]\w*(?=\s*\()`),
    rule('operator', String.raw`->|[-+*/%<>!=&|^~@]+`),
    rule('punctuation', String.raw`[{}()[\];,.:]`),
  ],
}
