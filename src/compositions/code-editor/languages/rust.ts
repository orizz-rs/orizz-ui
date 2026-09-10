import { rule, wordRule } from './rules'
import type { LanguageDefinition } from './types'

export const rustLanguage: LanguageDefinition = {
  id: 'rust',
  label: 'Rust',
  extensions: ['.rs'],
  lineCommentToken: '//',
  blockCommentTokens: ['/*', '*/'],
  indentAfterTokens: ['{'],
  indentUnit: '    ',
  rules: [
    rule('comment', String.raw`//[^\n]*`),
    rule('comment', String.raw`/\*[\s\S]*?\*/`),
    rule('string', String.raw`'(?:\\.|[^'\\\n])*'`),
    rule('keyword', String.raw`'(?:[A-Za-z_][\w]*|_)`),
    rule('string', String.raw`"(?:\\.|[^"\\])*"`),
    rule(
      'number',
      String.raw`0[xX][\da-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?(?:[iuf](?:8|16|32|64|128|size))?`,
    ),
    rule('function', String.raw`\b[A-Za-z_]\w*!`),
    wordRule('literal', ['true', 'false']),
    wordRule('keyword', [
      'as', 'async', 'await', 'break', 'const', 'continue', 'crate', 'dyn',
      'else', 'enum', 'extern', 'fn', 'for', 'if', 'impl', 'in', 'let',
      'loop', 'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self',
      'Self', 'static', 'struct', 'super', 'trait', 'type', 'unsafe', 'use',
      'where', 'while',
    ]),
    wordRule('type', [
      'bool', 'Box', 'char', 'f32', 'f64', 'HashMap', 'HashSet', 'i128',
      'i16', 'i32', 'i64', 'i8', 'isize', 'Option', 'Result', 'String',
      'str', 'u128', 'u16', 'u32', 'u64', 'u8', 'usize', 'Vec',
    ]),
    rule('function', String.raw`\b[A-Za-z_]\w*(?=\s*\()`),
    rule('operator', String.raw`->|=>|::|[+\-*/%=<>!&|^~?@]+`),
    rule('punctuation', String.raw`[{}()[\];,.:#]`),
  ],
}
