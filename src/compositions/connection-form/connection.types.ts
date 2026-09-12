/**
 * Data contracts for the connection form. No React, no DOM.
 */

export type DbEngine =
  | 'postgresql'
  | 'mysql'
  | 'mariadb'
  | 'sqlite'
  | 'sqlserver'
  | 'oracle'

export interface ConnectionValues {
  readonly name: string
  readonly engine: DbEngine
  readonly host: string
  readonly port: string
  readonly database: string
  readonly username: string
  readonly password: string
  readonly ssl: boolean
}

export const DB_ENGINES: readonly DbEngine[] = [
  'postgresql',
  'mysql',
  'mariadb',
  'sqlite',
  'sqlserver',
  'oracle',
]

export const DB_ENGINE_LABELS: Readonly<Record<DbEngine, string>> = {
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  mariadb: 'MariaDB',
  sqlite: 'SQLite',
  sqlserver: 'SQL Server',
  oracle: 'Oracle',
}

export const DEFAULT_PORTS: Readonly<Record<DbEngine, string>> = {
  postgresql: '5432',
  mysql: '3306',
  mariadb: '3306',
  sqlite: '',
  sqlserver: '1433',
  oracle: '1521',
}

export const EMPTY_CONNECTION: ConnectionValues = {
  name: '',
  engine: 'postgresql',
  host: '',
  port: DEFAULT_PORTS.postgresql,
  database: '',
  username: '',
  password: '',
  ssl: false,
}

export function createConnectionValues(
  overrides?: Partial<ConnectionValues>,
): ConnectionValues {
  const hasExplicitPort = overrides !== undefined && 'port' in overrides
  const port = hasExplicitPort
    ? (overrides.port ?? '')
    : DEFAULT_PORTS[overrides?.engine ?? EMPTY_CONNECTION.engine]
  return { ...EMPTY_CONNECTION, ...overrides, port }
}