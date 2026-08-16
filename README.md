# @orizz/ui

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
columns, runtime validation, per-column text/select filters, sorting, and custom
cell rendering.

## Install and use

Publish the package to the registry used by your organization, then install it
in a React application:

```bash
bun add @orizz/ui
```

Import the package stylesheet once near the application entry point:

```tsx
import '@orizz/ui/styles.css'
import { Button } from '@orizz/ui'

export function SaveAction() {
  return <Button variant="primary">Save</Button>
}
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

Change `@orizz/ui` to the real organization scope if needed. Authenticate with
your npm-compatible registry, choose the intended public/private access policy,
and publish:

```bash
bun publish
```

The `prepublishOnly` script validates lint, tests, and package output first.
