# @orizz-rs/ui

Shared React components for Orizz products. The package provides typed component
APIs, isolated styles, design tokens, unit tests, and Storybook documentation.

อ่านหลักการสี Theme, Token, Sizing และ Component standards ได้ที่
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

## Structure

```text
src/
├── components/
│   ├── badge/
│   ├── button/
│   ├── text-field/
│   └── index.ts
├── playground/             # Vite design-system showcase
├── styles/
│   └── tokens.css
├── test/
│   └── setup.ts
└── index.ts                 # public package API
```

Each component owns its implementation, styles, tests, stories, and local
exports. Only exports reachable from `src/index.ts` become public package APIs.

## Development

```bash
bun install
bun run dev
bun run test
bun run storybook
bun run build
```

The Vite app is a lightweight playground. Storybook is the component catalog.
The foundation currently includes 15 public components across actions, forms,
feedback, content, navigation, and data display. `DataTable<T>` provides typed
columns, automatic schema inference, runtime validation, per-column text/select
filters, sorting, and custom cell rendering.

Component icons use `lucide-react`. The package imports individual icons for
tree-shaking and sizes them through the design-system CSS rather than fixed
pixel values in JSX.

## Install and use

The package is configured for public publishing on npm. After the first public
release, install it in a React application without additional registry
configuration or authentication:

```bash
bun add @orizz-rs/ui
```

Import the package stylesheet once near the application entry point:

```tsx
import '@orizz-rs/ui/styles.css'
import { Button, DataTable } from '@orizz-rs/ui'

export function SaveAction() {
  return <Button variant="primary">Save</Button>
}
```

For a standard data screen, pass rows directly. `DataTable` infers headers,
stable row keys, sorting, and text/select filters; provide `columns` only for
advanced cell customization.

```tsx
<DataTable data={projects} />
```

## Themes and color usage

The semantic color system follows the 60/30/10 rule:

- 60% background tokens create the page foundation.
- 30% surface tokens create content hierarchy and containers.
- 10% green brand tokens draw attention to actions and key states.

Set `data-theme` on a parent element to choose an explicit theme. Without the
attribute, tokens follow the operating-system preference.

```tsx
<div data-theme="dark">
  <Button>Continue</Button>
</div>
```

Components consume semantic tokens such as `--orizz-color-brand` instead of
theme-specific color values, so the same component CSS works in both themes.

## Add another component

1. Copy the `src/components/button` convention into a new lowercase folder.
2. Export its component and public types from the folder's `index.ts`.
3. Re-export that folder from `src/components/index.ts`.
4. Add or reuse semantic tokens from `src/styles/tokens.css`.
5. Run lint, tests, Storybook build, and the package build before publishing.

## Publishing

Before publishing, update `version` in `package.json` and verify the package
contents locally:

```bash
bun run pack:check
```

Create a GitHub Release using a tag matching the package version, such as
`v0.1.1`. The
`Publish package` workflow installs locked dependencies, runs the publish
checks, builds the package, and publishes it publicly to npm. It can also be
started manually from the Actions tab when needed.

The first npm publish requires a repository secret named `NPM_TOKEN` with
permission to publish under the `orizz-rs` npm organization. After the package
exists on npm, configure its Trusted Publisher with these values and remove the
long-lived token:

- GitHub organization: `orizz-rs`
- Repository: `orizz-ui`
- Workflow filename: `publish-package.yml`
- Allowed action: `npm publish`

The workflow grants only `contents: read` and `id-token: write`, allowing npm
CLI to use short-lived OIDC credentials and automatically generate provenance.

Every published version must be unique. The `prepublishOnly` lifecycle validates
lint, types, and tests, while `prepack` creates the ESM, CommonJS, CSS, and type
declaration outputs.
