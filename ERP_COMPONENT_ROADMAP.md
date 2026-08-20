# ERP Component Roadmap

แผนนี้ใช้สำหรับพัฒนา `@orizz-rs/ui` ให้รองรับ ERP ของ Orizz โดยแบ่งเป็น
component พื้นฐานที่ใช้ได้กับทุกผลิตภัณฑ์ และ component แบบ ERP composition
ที่ประกอบจากข้อมูลและ business rule ของแต่ละแอป

## เป้าหมาย

- ทำให้ทุก ERP screen ใช้ interaction, spacing, typography และ theme ชุดเดียวกัน
- ลดการเขียน overlay, form validation, table state และ keyboard behavior ซ้ำในแต่ละทีม
- รองรับข้อมูลจำนวนมาก, ฟอร์มธุรกรรม และ workflow อนุมัติ
- รักษา base package ให้ไม่ผูกกับ API, ORM หรือ business domain ของแอปใดแอปหนึ่ง

## หลักการแบ่ง package

### `@orizz-rs/ui`

Component ที่เป็น generic และใช้ซ้ำได้กับทุกผลิตภัณฑ์ เช่น Button, Dialog,
Combobox, DataTable และ design tokens

### `@orizz-rs/erp-ui` (ระยะถัดไป)

Component ที่มีรูปแบบเฉพาะ ERP เช่น EntityPicker, LineItemEditor,
DocumentStatus และ ApprovalTimeline โดยรับ data และ callback จาก ERP app

ไม่ควรให้ component ใน base package fetch API เองหรือมี permission/business rule
ฝังอยู่ใน component

## สถานะปัจจุบัน

Branch: `feature/erp-component-foundation`

Foundation components ที่พร้อมทดลองใช้:

- `Button`
- `TextField`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`
- `FormField`
- `NumberInput`
- `CurrencyInput`
- `Combobox`
- `Dialog`
- `Popover`
- `Alert`, `Badge`, `Spinner`
- `Card`, `Avatar`, `Divider`
- `Tabs`
- `DataTable`

## Milestone 0 — Governance และ quality gate

งานที่ต้องคงไว้ก่อน merge component ใหม่:

- CI ตรวจ lint, typecheck, unit tests, package build และ Storybook build
- CODEOWNERS และ pull request checklist
- Changelog และ semantic versioning
- Storybook a11y checks และภายหลังเพิ่ม automated axe/visual regression
- ตรวจ bundle size และ dependency policy เมื่อ package ใหญ่ขึ้น

Definition of done สำหรับทุก component:

1. มี typed props และ exported public types
2. รองรับ native attributes และ `ref` เมื่อเหมาะสม
3. รองรับ light/dark theme ผ่าน semantic tokens
4. รองรับ keyboard, focus, screen reader และ browser zoom
5. มี loading, error, empty, disabled และ validation states ที่เกี่ยวข้อง
6. มี unit tests และ Storybook stories
7. ไม่มี `any`, index key, unsafe assertion หรือ static inline style
8. ผ่าน lint, typecheck, test, package build และ Storybook build

## Milestone 1 — Form และ overlay foundation (เสร็จแล้ว)

- `FormField`: label, required marker, hint และ error message
- `NumberInput`: native number input พร้อม `onValueChange`
- `CurrencyInput`: number input พร้อม currency adornment
- `Combobox`: search, listbox keyboard navigation, controlled/uncontrolled value,
  loading และ empty state
- `Dialog`: portal, modal semantics, Escape, backdrop close, focus restore
- `Popover`: portal, alignment, click outside, Escape และ trigger state

## Milestone 2 — Enterprise DataTable (in progress)

ลำดับการทำงาน:

1. Controlled sort, filter และ client pagination state — เสร็จ
2. Loading, error, empty และ retry state — เสร็จ
3. Row selection, select all และ bulk action toolbar — เสร็จ
4. Client/server pagination contract
5. Column visibility, ordering, sticky header และ sticky first column
6. Expandable row และ editable cell
7. Server-side filter/sort callbacks
8. Virtualized rows สำหรับข้อมูลจำนวนมาก
9. Export CSV/XLSX ผ่าน callback ไม่ผูกกับ library ใด library หนึ่ง

DataTable ต้องรักษา stable row id และประกาศ `aria-sort`, selection state,
caption และ keyboard behavior ให้ครบ

## Milestone 3 — Navigation และ feedback (in progress)

ชุดแรกเสร็จแล้วและมีตัวอย่างใน playground:

- `Breadcrumb`
- `Pagination`
- `Toast`
- `Skeleton`
- `EmptyState`
- `Progress`

- `Breadcrumb`
- `Pagination`
- `Sidebar` (เสร็จแล้ว)
- `NavigationMenu` (เสร็จแล้ว)
- `PageHeader` (เสร็จแล้ว)
- `Toolbar` (เสร็จแล้ว)
- `SplitPane` (เสร็จแล้ว)
- `Stepper` (เสร็จแล้ว)
- `Accordion` (เสร็จแล้ว)
- `Collapsible`
- `Toast`
- `Skeleton`
- `Progress`
- `EmptyState`
- `ResultState` (เสร็จแล้ว)
- `LoadingOverlay` (เสร็จแล้ว)
- `Timeline` (เสร็จแล้ว)

## Milestone 4 — ERP form controls

- `DatePicker` (เสร็จแล้ว) และ `DateRangePicker`
- `MultiSelect` (เสร็จแล้ว)
- `AsyncCombobox` (เสร็จแล้ว)
- `PercentageInput` (เสร็จแล้ว)
- `QuantityInput` (เสร็จแล้ว)
- `TimeInput` (เสร็จแล้ว)
- `FileUpload` (เสร็จแล้ว)
- `Form`, `Fieldset` (เสร็จแล้ว) และ validation message helpers

การแสดงเงิน, ตัวเลข, วันที่ และเวลาให้ใช้ `Intl` และรับ locale/timezone จากแอป
ไม่ hard-code ภาษาไทยหรือรูปแบบวันที่ไว้ใน component

## Milestone 5 — ERP composition layer

Component ที่ควรอยู่ใน `@orizz-rs/erp-ui` หรือ package composition แยก:

- `EntityPicker` สำหรับ customer, supplier, product และ warehouse
- `DocumentStatus`
- `DocumentActions`
- `LineItemEditor`
- `MoneyDisplay`
- `QuantityDisplay`
- `TaxSummary`
- `ApprovalTimeline`
- `AuditLog`
- `KeyValueList`
- `KpiCard`

Component กลุ่มนี้ต้องรับ entity data, formatter, permission result และ callbacks
จากแอป ไม่ควรเรียก backend โดยตรง

## Release plan

- `0.2.0`: Dialog, Popover, FormField, NumberInput, CurrencyInput, Combobox
- `0.3.0`: DatePicker, MultiSelect และ DataTable enterprise features
- `0.4.0`: Navigation, Toast, Skeleton และ feedback patterns
- `0.5.0`: ERP composition package ชุดแรก

ทุก release ต้องมี changelog, unique npm version, matching Git tag,
GitHub Release และ package verification

## Branch strategy

- Integration branch: `feature/erp-component-foundation`
- แยกงานย่อยเป็น `feature/erp-data-table`, `feature/erp-navigation`,
  `feature/erp-form-controls` และ `feature/erp-compositions`
- ทุก branch เปิด PR เข้า integration branch ก่อน merge เข้า `master`
- ไม่ควรทำ business-specific component ใน base package โดยไม่มีเหตุผลร่วมกัน
