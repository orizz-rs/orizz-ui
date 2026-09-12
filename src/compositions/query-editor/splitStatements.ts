/** Removes line and block comments while keeping line structure intact. */
function stripComments(sql: string): string {
  let result = ''
  let lineComment = false
  let blockComment = false
  let index = 0

  while (index < sql.length) {
    const char = sql[index] ?? ''
    const next = sql[index + 1] ?? ''

    if (lineComment) {
      if (char === '\n') {
        lineComment = false
        result += char
      }
      index += 1
      continue
    }

    if (blockComment) {
      if (char === '*' && next === '/') {
        result += ' '
        index += 2
        blockComment = false
      } else {
        index += 1
      }
      continue
    }

    if (char === '-' && next === '-') {
      index += 2
      lineComment = true
      continue
    }

    if (char === '/' && next === '*') {
      index += 2
      blockComment = true
      continue
    }

    result += char
    index += 1
  }

  return result
}

function hasExecutableCode(sql: string): boolean {
  return stripComments(sql).trim() !== ''
}

/**
 * Splits SQL text into individual statements. A semicolon only terminates a
 * statement when it appears outside string literals (' ', " ", ` `) and
 * comments (-- and /* *\/). Statements made exclusively of comments are
 * dropped. Pure text processing — no React, no DOM.
 */
export function splitStatements(sql: string): readonly string[] {
  const statements: string[] = []
  let current = ''
  let quote: string | null = null
  let lineComment = false
  let blockComment = false
  let index = 0

  while (index < sql.length) {
    const char = sql[index] ?? ''
    const next = sql[index + 1] ?? ''

    if (lineComment) {
      current += char
      if (char === '\n') lineComment = false
      index += 1
      continue
    }

    if (blockComment) {
      current += char
      if (char === '*' && next === '/') {
        current += next
        index += 2
        blockComment = false
      } else {
        index += 1
      }
      continue
    }

    if (quote !== null) {
      current += char
      if (char === quote) {
        if (next === quote) {
          current += next
          index += 2
        } else {
          quote = null
          index += 1
        }
      } else {
        index += 1
      }
      continue
    }

    if (char === '-' && next === '-') {
      current += char + next
      index += 2
      lineComment = true
      continue
    }

    if (char === '/' && next === '*') {
      current += char + next
      index += 2
      blockComment = true
      continue
    }

    if (char === "'" || char === '"' || char === '`') {
      quote = char
      current += char
      index += 1
      continue
    }

    if (char === ';') {
      const statement = current.trim()
      if (statement.length > 0 && hasExecutableCode(statement)) {
        statements.push(statement)
      }
      current = ''
      index += 1
      continue
    }

    current += char
    index += 1
  }

  const tail = current.trim()
  if (tail.length > 0 && hasExecutableCode(tail)) statements.push(tail)
  return statements
}