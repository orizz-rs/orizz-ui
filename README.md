# @orizz-rs/ui

Shared React components for Orizz products. The package provides typed component
APIs, isolated styles, design tokens, unit tests, and Storybook documentation.

อ่านหลักการสี Theme, Token, Sizing และ Component standards ได้ที่
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

เอกสารสำหรับทำ documentation website อยู่ที่ [`docs/`](./docs/README.md)
ประกอบด้วย getting started, component catalog, design system และ content สำหรับ
เว็บไซต์ Orizz RS

แผน component สำหรับ ERP และลำดับ milestone อยู่ที่
[`ERP_COMPONENT_ROADMAP.md`](./ERP_COMPONENT_ROADMAP.md)

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
The foundation currently includes 46 public components across actions, forms,
feedback, content, navigation, overlays, and data display. `DataTable<T>` provides typed
columns, automatic schema inference, runtime validation, per-column text/select
filters, sorting, and custom cell rendering.

Component icons use `lucide-react`. The package bundles only the selected icons
and sizes them through the design-system CSS rather than fixed pixel values in
JSX. React and React DOM remain peer dependencies so the consuming application
provides one shared React instance.

## Install and use

The package is published publicly to the npm registry. Install the current
release in a React application without additional registry configuration:

```bash
bun add @orizz-rs/ui@0.2.4
```

To verify the package and registry before installing:

```bash
npm view @orizz-rs/ui version --registry=https://registry.npmjs.org
npm view @orizz-rs/ui@0.2.4 dist.tarball --registry=https://registry.npmjs.org
```

Import a component and use it immediately. The package entry automatically
loads the component styles, design tokens, light/dark themes, and Bai Jamjuree
font, so the consuming application does not need a separate CSS import:

```tsx
import { Button, DataTable } from '@orizz-rs/ui'

export function SaveAction() {
  return <Button variant="primary">Save</Button>
}
```

The `@orizz-rs/ui/styles.css` export remains available as an explicit fallback
for tools that do not process CSS imports from dependencies. Do not import it
again in standard Vite or other CSS-aware application builds.

Package conditions automatically use a CSS-free JavaScript entry in Node,
SSR, and test runners, while browser bundlers use the styled entry. Both are
selected through the same `@orizz-rs/ui` import.

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

## Local package testing

For the closest match to a real npm installation, create and install a tarball
instead of adding the repository directory directly:

```bash
# Run in orizz-ui
bun run pack:local

# Run in the consuming application; use the generated absolute path
bun add /path/to/orizz-ui/.local-pack/orizz-rs-ui-0.2.4.tgz
```

A direct `file:/path/to/orizz-ui` dependency is a development symlink. Vite can
then resolve React from both projects and report an `Invalid hook call`. If a
link is required, deduplicate React in the consuming application's
`vite.config.ts`:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
```

This local-link setting is not required after installing the published npm
package.

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

For a public release, confirm the package scope and publishing permissions on
npmjs.com:

1. Create or confirm the `orizz-rs` npm organization.
2. Add the publishing account as an owner or to a team with package write access.
3. Create a granular access token with read/write access to the `orizz-rs`
   scope. Enable bypass 2FA when the token is used for automation.
4. Run the secure local publishing script. It prompts for the token without
   echoing or saving it:

```bash
bun run publish:public
```

If the npm account requires interactive 2FA, the script uses legacy auth mode
so the one-time password can be entered in the terminal.

Create a GitHub Release using a tag matching the package version, such as
`v0.2.4`. The
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
