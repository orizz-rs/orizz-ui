# Getting started

## ติดตั้ง

```bash
bun add @orizz-rs/ui
```

หรือใช้ npm:

```bash
npm install @orizz-rs/ui
```

## ใช้งาน component

```tsx
import { Button, DataTable } from '@orizz-rs/ui'

export function SaveAction(): JSX.Element {
  return <Button variant="primary">Save</Button>
}
```

การ import package entry ปกติจะโหลด component styles, design tokens, theme และ
ฟอนต์ Bai Jamjuree ให้แล้ว จึงไม่ต้อง import CSS ซ้ำใน Vite หรือ bundler ที่รองรับ
CSS imports

ถ้า tooling ต้องการ import CSS แยก ให้ใช้:

```ts
import '@orizz-rs/ui/styles.css'
```

## Theme

กำหนด theme ที่ root ของ application หรือ section ใดก็ได้:

```tsx
<div data-theme="dark">
  <Button>Continue</Button>
</div>
```

ค่าที่รองรับคือ `light` และ `dark` หากไม่กำหนด attribute ระบบจะตาม
`prefers-color-scheme` ของผู้ใช้

## DataTable แบบพื้นฐาน

```tsx
const projects = [
  { id: 'p-1', name: 'Orizz ERP', status: 'active', members: 12 },
  { id: 'p-2', name: 'Finance Console', status: 'draft', members: 4 },
]

<DataTable data={projects} caption="Projects" />
```

ระบบจะ infer header, row id, sorting และ filter จากข้อมูลให้เอง สำหรับการควบคุม
column, cell renderer, alignment หรือ validation ให้ประกาศ `columns` เพิ่ม

## Local development

```bash
bun install
bun run dev             # Vite playground
bun run storybook       # component catalog
bun run test
bun run typecheck
bun run build
```

