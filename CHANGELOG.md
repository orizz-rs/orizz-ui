# Changelog

All notable changes to `@orizz-rs/ui` are documented here.

## [Unreleased]

### Added

- `TreeView` primitive with nested nodes, icons, controlled/uncontrolled
  expansion, lazy `loadChildren`, WAI-ARIA tree keyboard navigation, disabled
  nodes, and light/dark theme support.
- `CodeEditor` composition with multi-language support: syntax highlighting,
  line numbers, caret position, Tab indent, Enter auto-indent, language
  picker, read-only state, and light/dark themes.
- Language layer separated from the editor UI: `LanguageDefinition` data
  contract, pure `tokenizeCode` engine, registry with `registerLanguage` and
  file-extension detection, plus built-in definitions for TypeScript,
  JavaScript, JSON, Python, Rust, SQL, and plain text.
- `DataTable` grid features for database-client result views: `density`,
  `stickyHeader`, `stickyFirstColumn`, `maxHeight`, `showRowNumbers`, column
  `width`/`minWidth`/`numeric`/`hidden`, a column settings popover, and a
  server-mode contract (`totalRows` with controlled `sort`, `pageIndex`, and
  `filters`).

## [0.2.5] - 2026-08-22

### Changed

- Reorganized the internal source structure into components, compositions,
  foundations, hooks, and utilities.
- Moved `DataTable` into the compositions layer without changing the package
  root public API.

## [0.2.4] - 2026-08-20

### Added

- Date and selection controls: `DatePicker`, `TimeInput`, and `MultiSelect`.
- ERP value inputs: `PercentageInput` and `QuantityInput`.
- Data-connected and document controls: `AsyncCombobox` and `FileUpload`.
- Form composition primitives: `Form`, `FormActions`, and `Fieldset`.
- Storybook stories, unit tests, public exports, and ERP playground examples
  for all new components.

### Changed

- Updated the component catalog and ERP roadmap for 46 public components.

## [0.2.1] - 2026-08-19

- Updated the npm package homepage to the Orizz RS documentation site.

## [0.1.2] - 2026-08-17

- Published the shared Orizz React component package under the MIT license.
- Added automatic browser CSS loading with light/dark theme tokens and Bai
  Jamjuree font assets.
- Added typed foundation components for actions, forms, feedback, content,
  navigation, and data display.
- Added automatic `DataTable` columns, sorting, filtering, validation, and
  custom React cell rendering.
- Kept React and React DOM as peer dependencies and added Node-safe package
  entries for SSR and test runners.

## [0.2.0] - 2026-08-19

- Added ERP navigation shell components: `Sidebar`, `PageHeader`, and `Toolbar`.
- Added navigation and disclosure components: `NavigationMenu`, `Accordion`,
  `Breadcrumb`, `Pagination`, and `Tabs` patterns for ERP screens.
- Added layout and workflow components: `SplitPane` and `Stepper`.
- Added feedback and audit components: `ResultState`, `LoadingOverlay`,
  `Timeline`, `Toast`, `Skeleton`, `Progress`, and `EmptyState`.
- Added ERP playground showcases, Storybook stories, unit tests, and public
  package exports for the new components.
- Verified light/dark theme CSS, package builds, type declarations, and browser
  CSS/font injection for the release package.

## Unreleased

- Added ERP foundation components on `feature/erp-component-foundation`:
  `FormField`, `NumberInput`, `CurrencyInput`, `Combobox`, `Dialog`, and
  `Popover`.
- Added pull-request quality checks and contribution governance files.
