# Orizz Design System

เอกสารนี้เป็นแนวทางกลางสำหรับการออกแบบและพัฒนา UI ของผลิตภัณฑ์ Orizz
เพื่อให้ทุกทีมสร้างประสบการณ์ที่สม่ำเสมอ เข้าถึงได้ และรองรับทั้ง Light และ
Dark theme

## 1. Design principles

### Clear by design

UI ต้องสื่อสารลำดับความสำคัญได้ชัดเจน ผู้ใช้ควรเข้าใจว่าอะไรคือข้อมูลหลัก
อะไรสามารถกดได้ และขั้นตอนถัดไปคืออะไร โดยไม่ต้องพึ่งคำอธิบายมากเกินไป

### Green by purpose

สีเขียวเป็นสีแบรนด์และใช้เพื่อดึงความสนใจไปยัง action หรือสถานะสำคัญ
ไม่ควรใช้สีเขียวครอบคลุมทุกส่วนของหน้าจอ เพราะจะทำให้ลำดับความสำคัญหายไป

### Accessible by default

Component ต้องรองรับ keyboard, focus state, screen reader, browser zoom,
การตั้งค่าขนาดตัวอักษรของผู้ใช้ และ `prefers-reduced-motion`

### Built from tokens

Component ต้องใช้ semantic token แทนการระบุค่าสีหรือ spacing แบบ hard-coded
เพื่อให้เปลี่ยน theme และปรับภาพรวมของระบบได้จากจุดเดียว

## 2. Color system: 60 / 30 / 10

ระบบสีใช้กฎ 60/30/10 เพื่อรักษาสมดุลและลำดับความสำคัญของหน้าจอ

| สัดส่วน | บทบาท | ตัวอย่างการใช้งาน |
|---|---|---|
| 60% | Background | พื้นหลังหน้า, พื้นที่ว่าง, application shell |
| 30% | Surface | Card, panel, navigation, form container |
| 10% | Brand accent | Primary action, link, focus, highlight สำคัญ |

กฎนี้เป็นแนวทางระดับ composition ไม่จำเป็นต้องวัดจำนวน pixel ให้ตรงสัดส่วน
ทุกหน้า แต่ควรรักษาความรู้สึกโดยรวมไม่ให้ brand color แย่งความสนใจจากเนื้อหา

### Primary green palette

| Token | Light-theme value | หน้าที่หลัก |
|---|---:|---|
| `--orizz-green-50` | `#effcf3` | พื้นหลังเขียวอ่อนมาก |
| `--orizz-green-100` | `#d9f7e2` | Brand subtle |
| `--orizz-green-400` | `#48c879` | Brand หลักสำหรับ Dark theme |
| `--orizz-green-700` | `#106b39` | Brand หลักสำหรับ Light theme |
| `--orizz-green-800` | `#105530` | Hover บน Light theme |
| `--orizz-green-950` | `#062817` | สีข้อความบนเขียวสว่าง |

Primitive palette ใช้อ้างอิงในการสร้าง token เท่านั้น Component ควรใช้
semantic token เช่น `--orizz-color-brand` แทน `--orizz-green-700` โดยตรง

## 3. Themes

Design System รองรับ `light` และ `dark` ผ่าน `data-theme`

```tsx
<div data-theme="light">
  <App />
</div>
```

```tsx
<div data-theme="dark">
  <App />
</div>
```

หากไม่ได้ระบุ `data-theme` ระบบจะใช้ค่าจาก `prefers-color-scheme`
ของระบบปฏิบัติการ

### Semantic theme tokens

| Token | หน้าที่ |
|---|---|
| `--orizz-color-background` | พื้นหลังหลักตามสัดส่วน 60% |
| `--orizz-color-background-subtle` | พื้นหลังรอง |
| `--orizz-color-surface` | พื้นผิว content ตามสัดส่วน 30% |
| `--orizz-color-surface-raised` | Card หรือ content ที่ยกขึ้นมา |
| `--orizz-color-surface-muted` | Surface ที่ลดความสำคัญ |
| `--orizz-color-brand` | สีแบรนด์และ action ตามสัดส่วน 10% |
| `--orizz-color-brand-hover` | Hover ของ brand action |
| `--orizz-color-brand-subtle` | Brand background ที่ไม่เด่นเกินไป |
| `--orizz-color-text` | ข้อความหลัก |
| `--orizz-color-text-muted` | ข้อความรอง |
| `--orizz-color-border` | เส้นแบ่งและ border ทั่วไป |
| `--orizz-color-focus` | Focus ring |

Component ไม่ควรกำหนดค่าสีแยกตาม theme เอง ตัวอย่างที่ควรใช้:

```css
.button {
  color: var(--orizz-color-on-brand);
  background: var(--orizz-color-brand);
}

.button:hover {
  background: var(--orizz-color-brand-hover);
}
```

## 4. Typography

Font หลักใช้ **Bai Jamjuree** ซึ่งรองรับทั้งภาษาไทยและ Latin โดย self-host
ผ่าน Fontsource เพื่อให้หน้า application, Storybook และ package ใช้ไฟล์เดียวกัน
โดยไม่ต้องเชื่อมต่อ font CDN ขณะใช้งาน

```css
font-family: var(--orizz-font-sans);
```

น้ำหนักที่ bundle ไว้คือ `400`, `500`, `600` และ `700` เฉพาะ normal style
ควรเลือกจากน้ำหนักเหล่านี้เพื่อหลีกเลี่ยง browser สร้าง synthetic weight

ใช้ monospace token สำหรับ code, token name หรือข้อมูลเชิงเทคนิค

```css
font-family: var(--orizz-font-mono);
```

แนวทาง typography:

- Body text ควรมี line height ประมาณ `1.5–1.7`
- ข้อความทั่วไปไม่ควรเล็กกว่า `0.875rem`
- Supporting text สามารถใช้ `0.75rem` ได้เมื่อ contrast เพียงพอ
- Heading ใช้น้ำหนักและขนาดเพื่อสร้างลำดับชั้น ไม่ใช้สีเพียงอย่างเดียว
- หลีกเลี่ยงการใช้ตัวพิมพ์ใหญ่กับข้อความยาว

## 5. Sizing and units

ใช้ `rem` เป็นหน่วยหลักสำหรับ typography, spacing, radius และขนาด component
เพื่อให้ UI ปรับตาม root font size ของผู้ใช้

| งาน | Unit ที่แนะนำ |
|---|---|
| Font size | `rem` |
| Spacing และ control height | `rem` |
| Border radius | `rem` |
| Icon ที่ต้องโตตามข้อความ | `em` |
| Border บางคงที่ | `1px` |
| Page layout | `%`, `fr`, `minmax()` |
| Responsive typography | `clamp()` ร่วมกับ `rem` และ `vw` |

ตัวอย่าง:

```css
.control {
  min-height: 2.5rem;
  padding-inline: var(--orizz-space-4);
  border: 1px solid var(--orizz-color-border);
  border-radius: var(--orizz-radius-md);
  font-size: 0.875rem;
}
```

ไม่ควรตั้ง `html { font-size: 62.5%; }` เพราะจะ override ขนาดตัวอักษรเริ่มต้น
ที่ผู้ใช้กำหนดไว้

### Iconography

ใช้ icon จาก `lucide-react` เป็นชุดมาตรฐานเดียวกันทั้งระบบ โดย import เฉพาะ icon
ที่ component ใช้งานเพื่อรองรับ tree-shaking กำหนดสีด้วย `currentColor` และกำหนดขนาด
ผ่าน CSS ด้วย `rem` หรือ `em` แทนการส่งขนาดเป็น pixel ใน JSX

Icon ที่ใช้ประกอบข้อความควรใส่ `aria-hidden="true"` และมีข้อความหรือ
`aria-label` บน interactive element เป็น accessible name เสมอ หาก icon สื่อความหมาย
โดยไม่มีข้อความประกอบ ต้องกำหนด accessible label ให้ชัดเจน

## 6. Spacing

Spacing ใช้ระบบฐาน 4 โดยเลือกจาก token ที่กำหนดไว้

| Token | Value |
|---|---:|
| `--orizz-space-1` | `0.25rem` |
| `--orizz-space-2` | `0.5rem` |
| `--orizz-space-3` | `0.75rem` |
| `--orizz-space-4` | `1rem` |
| `--orizz-space-6` | `1.5rem` |
| `--orizz-space-8` | `2rem` |
| `--orizz-space-12` | `3rem` |
| `--orizz-space-16` | `4rem` |

ไม่ควรเพิ่มค่าระหว่างกลางโดยไม่มีเหตุผล เช่น `0.6875rem` สำหรับ spacing
เพราะจะทำให้ rhythm ของหน้าจอไม่สม่ำเสมอ

## 7. Shape and elevation

| Token | การใช้งาน |
|---|---|
| `--orizz-radius-sm` | Badge, element ขนาดเล็ก |
| `--orizz-radius-md` | Button, input |
| `--orizz-radius-lg` | Card และ panel |
| `--orizz-radius-xl` | Feature card หรือ container ขนาดใหญ่ |
| `--orizz-shadow-sm` | Surface ที่ต้องแยกจากพื้นหลังเล็กน้อย |
| `--orizz-shadow-md` | Modal หรือ feature card สำคัญ |

ใช้ elevation เท่าที่จำเป็น ควรใช้ background, border และ spacing
สร้าง hierarchy ก่อนเพิ่ม shadow

## 8. Components

Foundation package ปัจจุบันมี 15 components:

| กลุ่ม | Components |
|---|---|
| Actions | `Button` |
| Forms | `TextField`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch` |
| Feedback | `Alert`, `Badge`, `Spinner` |
| Content | `Card`, `Avatar`, `Divider` |
| Navigation | `Tabs` |
| Data display | `DataTable` |

Component ทั้งหมดใช้ native HTML semantics เป็นฐาน รองรับ Light/Dark theme
และรับค่าจาก semantic tokens ชุดเดียวกัน

### DataTable contract

โหมดพื้นฐานรับแค่ `data` แล้วระบบจะสร้าง header, row key, sort และ filter ให้เอง
เหมาะกับหน้ารายการทั่วไปที่ไม่ต้อง custom cell

```tsx
const members = [
  { id: 'm1', name: 'Anan', status: 'active', projects: 12 },
  { id: 'm2', name: 'Mali', status: 'invited', projects: 8 },
]

<DataTable data={members} />
```

ระบบซ่อน `id`/`_id`, แปลง camelCase หรือ snake_case เป็น header ที่อ่านง่าย,
จัดตัวเลขชิดขวา, เปิด sort และเลือก text หรือ select filter จากชนิด/จำนวนค่าที่พบ
เช่น field ชื่อ status, state, type, role, category และ priority จะใช้ select เมื่อ
มีตัวเลือกไม่เกิน 8 ค่า

สามารถส่ง React UI เป็นค่าของ row ได้โดยตรง ระบบจะ render component และอ่านข้อความ
จาก `children` เพื่อสร้าง sort/filter เช่น Member ใช้ text filter และ Status ที่เป็น
Badge ใช้ select filter ส่วน field ชื่อ `action`/`actions` จะไม่สร้าง operation เหล่านี้

```tsx
const rows = [
  {
    id: 'm1',
    member: <Avatar alt="Anan" fallback="AN" />,
    status: <Badge tone="success">Active</Badge>,
    projects: 12,
    action: <Button>View</Button>,
  },
]

<DataTable data={rows} />
```

React elements ไม่สามารถมากับ JSON API โดยตรง จึงควรประกอบ UI values หลัง fetch
ข้อมูลแล้ว หากต้องการแยก data กับ presentation ชัดเจน ให้ใช้ advanced `cell` renderer
แทนได้

เมื่อต้องการ custom cell ให้ส่ง `columns` และ `getRowId` แบบ advanced
`DataTable<T>` จะตรวจ `accessor` ด้วย `keyof T` ตั้งแต่ compile time และตรวจข้อมูล
จาก API ซ้ำอีกครั้งใน runtime

```tsx
interface MemberRow {
  readonly id: string
  readonly name: string
  readonly email?: string
  readonly status: 'active' | 'invited'
}

const columns: readonly DataTableColumn<MemberRow>[] = [
  {
    id: 'member',
    header: 'Member',
    accessor: 'name',
    sortable: true,
    filter: { type: 'text', placeholder: 'Search members…' },
    filterValue: (row) => `${row.name} ${row.email ?? ''}`,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    filter: {
      type: 'select',
      placeholder: 'All statuses',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'invited', label: 'Invited' },
      ],
    },
    cell: (row) => <Badge tone="success">{row.status}</Badge>,
  },
]

<DataTable
  columns={columns}
  data={members}
  getRowId={(row) => row.id}
  caption="Organization members"
/>
```

Column API ที่สำคัญ:

| Property | หน้าที่ |
|---|---|
| `id` | Stable ID ของ column และต้องไม่ซ้ำ |
| `header` | Header content รองรับ `ReactNode` |
| `accessor` | Key ของ row สำหรับค่าพื้นฐานและ validation |
| `cell` | Custom cell renderer |
| `required` | กำหนดว่าค่าจาก accessor ต้องไม่ว่าง |
| `sortable` | เปิด sort asc/desc/clear |
| `compare` | Custom row comparator |
| `sortValue` | ค่าที่ใช้ sort เมื่อค่าที่แสดงไม่ใช่ accessor โดยตรง |
| `filter` | แสดง filter ใต้ header โดยใช้ `{ type: 'text' }` หรือ `{ type: 'select', options }` |
| `filterValue` | กำหนดค่าที่ใช้กรอง เมื่อค่าจริงไม่ได้มาจาก accessor หรือต้องรวมหลาย field |
| `align` | จัดตำแหน่ง `start`, `center` หรือ `end` |

Text filter ใช้การค้นหาแบบ contains โดยไม่แยกตัวพิมพ์เล็ก/ใหญ่ ส่วน select filter
เหมาะกับ enum หรือ status ที่มีค่าจำกัดและเปรียบเทียบค่าแบบ exact เมื่อผู้ใช้กรอง
หลาย column พร้อมกัน ตารางจะรวมเงื่อนไขแบบ AND ใช้ปุ่ม filter ที่หัว column เพื่อ
เปิด popover ผ่าน portal จึงไม่เพิ่มความสูงและไม่ถูกตัดด้วยขอบ/scrollbar ของตาราง
ใช้ปุ่ม Clear รูป X เพื่อล้างค่าเฉพาะ column นั้น และคลิกด้านนอกหรือกด Escape เพื่อปิดได้

Runtime validation ตรวจสอบ:

- Column ID ซ้ำ
- Header ไม่ครบ
- Column ไม่มีทั้ง `accessor` และ `cell`
- Column ที่เปิด filter ไม่มีทั้ง `accessor` และ `filterValue`
- Select filter ไม่มี options, option ว่าง หรือมี value ซ้ำกัน
- Row ID ว่างหรือซ้ำ
- Required value เป็น `null`, `undefined` หรือข้อความว่าง

Schema และ row identity errors จะหยุด render table เพื่อป้องกัน React key หรือ
column mapping ที่ผิด ส่วน required value จะแสดง validation summary และยัง render
ข้อมูลที่เหลือโดยใช้ `—` แทนค่าที่ขาด สามารถเรียก `validateDataTable()` แยกก่อน
render ได้เมื่อต้องการตรวจข้อมูลใน service หรือ adapter layer

### Component folder convention

```text
src/components/component-name/
├── ComponentName.tsx
├── ComponentName.module.css
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
└── index.ts
```

ทุก Component ต้องมี:

1. Props ที่ระบุ type ชัดเจนและไม่ใช้ `any`
2. Style ที่ใช้ semantic token
3. Keyboard และ focus behavior ที่เหมาะสม
4. Unit tests สำหรับ behavior สำคัญ
5. Storybook stories ครอบคลุม variant และ state
6. Public export ผ่าน `src/components/index.ts`

## 9. Accessibility checklist

ก่อนเพิ่ม Component หรือ publish package ให้ตรวจสอบว่า:

- ใช้ semantic HTML ก่อนเพิ่ม ARIA
- ทุก interactive element ใช้งานผ่าน keyboard ได้
- มี `:focus-visible` ที่เห็นได้ชัดในทั้งสอง theme
- Input ทุกตัวมี label
- Error ไม่สื่อสารด้วยสีเพียงอย่างเดียว
- Loading และ disabled state มี accessible state ที่เหมาะสม
- สีข้อความและ control มี contrast เพียงพอ
- Animation รองรับ `prefers-reduced-motion`
- UI ยังใช้งานได้เมื่อ zoom ถึง 200%
- Light และ Dark theme แสดงผลได้ครบทุก state

## 10. Package usage

ติดตั้ง package และ import stylesheet หนึ่งครั้งที่ application entry:

```tsx
import '@orizz/ui/styles.css'
import { Alert, Badge, Button, TextField } from '@orizz/ui'

export function Example() {
  return (
    <div data-theme="light">
      <Badge tone="success">Active</Badge>
      <Alert title="Ready" tone="success">Workspace created.</Alert>
      <TextField label="Project name" />
      <Button>Save project</Button>
    </div>
  )
}
```

## 11. Definition of done

ก่อน merge หรือ publish การเปลี่ยนแปลงของ Design System ต้องผ่าน:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
bun run build-storybook
```

Source of truth ของ token อยู่ที่ `src/styles/tokens.css` และหน้า Vite
playground ใช้สำหรับตรวจภาพรวมของระบบ ส่วน Storybook ใช้ตรวจ Component
แต่ละตัวในทุก state และ theme
