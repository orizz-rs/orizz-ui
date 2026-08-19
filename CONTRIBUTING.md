# Contributing to Orizz UI

Orizz UI is the shared React component library for Orizz products. Changes
should improve consistency without coupling the base package to a single
product's API or business logic.

## Development

```bash
bun install
bun run lint
bun run typecheck
bun run test
bun run build
bun run build-storybook
```

Use `feature/<short-name>` branches and open a pull request into `master`.
The quality workflow must pass before merge.

## Component requirements

Each component should include its implementation, CSS module, tests, stories,
and public export. Prefer native HTML semantics and typed native attributes.
Components must use semantic tokens, support both themes, preserve browser zoom,
and expose accessible names, keyboard behavior, focus states, and error states.

Keep data fetching and ERP business rules outside the base UI package. Accept
data and callbacks through typed props so the same component can be used by
multiple products.

Avoid `any`, unsafe assertions, index keys, `React.FC`, static inline styles,
and components that combine large state machines with large render trees.

## Release process

Use semantic versioning. Every published npm version must be unique. Add a
release note to `CHANGELOG.md`, update `package.json`, run the complete checks,
create a matching `v<version>` tag, and publish a GitHub Release.
