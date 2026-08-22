# Project architecture

## Layers

| Layer | Responsibility | Examples |
|---|---|---|
| `components/` | Reusable UI primitives with no workflow assumptions | `Button`, `Dialog`, `DatePicker` |
| `compositions/` | Reusable structures composed from multiple primitives | `DataTable` |
| `foundations/` | Shared visual rules and design-system conventions | tokens, typography, icons |
| `hooks/` | React hooks shared by more than one component | future shared focus or media hooks |
| `utils/` | Framework-independent helpers | formatters and validation helpers |
| `playground/` | Vite examples; not part of the published API | ERP workflow demos |

## Public API contract

Consumers import only from the package root:

```tsx
import { Button, DataTable } from '@orizz-rs/ui'
```

Internal folder moves must preserve exports from `src/index.ts`. This allows
the project structure to evolve without changing consumer code.

## Placement rule

Start a new building block in `components/`. Move it to `compositions/` when it
owns multiple child components, cross-cutting state, or a workflow-level API.
Keep hooks private to their component folder until at least two consumers need
the same behavior.
