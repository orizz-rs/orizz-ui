# Components

ทุก component ใช้ native HTML semantics เป็นฐาน, รับ semantic tokens ชุดเดียวกัน,
รองรับ light/dark theme และควรใช้งานผ่าน public export จาก `@orizz-rs/ui`

## Actions

| Component | ใช้สำหรับ |
|---|---|
| `Button` | action หลัก, รอง, ghost และ destructive พร้อม loading state |

## Forms

| Component | ใช้สำหรับ |
|---|---|
| `TextField` | input ข้อความแบบ single-line |
| `Textarea` | ข้อความหลายบรรทัด |
| `Select` | เลือกค่าจาก native select |
| `Checkbox` | เลือกค่าหลายรายการหรือ boolean |
| `Radio` | เลือกค่าเดียวจากกลุ่ม |
| `Switch` | เปิด/ปิด setting |
| `FormField` | label, hint, required และ error state |
| `NumberInput` | รับค่าตัวเลขพร้อม `onValueChange` |
| `CurrencyInput` | รับจำนวนเงินพร้อม currency adornment |
| `Combobox` | ค้นหาและเลือก option พร้อม keyboard navigation |
| `DatePicker` | เลือกวันที่ผ่าน native browser date picker |
| `MultiSelect` | เลือกได้หลาย option พร้อม controlled/uncontrolled values |
| `PercentageInput` | รับค่าเปอร์เซ็นต์พร้อม `%` suffix |
| `QuantityInput` | รับจำนวนพร้อม unit เช่น kg หรือ pcs |
| `TimeInput` | เลือกเวลาผ่าน native browser time picker |
| `AsyncCombobox` | ค้นหา option จาก async data source พร้อม loading/error state |
| `FileUpload` | เลือกและจัดการไฟล์แนบ พร้อม validation ของจำนวนและขนาดไฟล์ |
| `Form` | form wrapper สำหรับ submit state, error summary และ action layout |
| `Fieldset` | group ของ field ที่มี legend, description และ native disabled state |

## Feedback

| Component | ใช้สำหรับ |
|---|---|
| `Alert` | ข้อความสถานะหรือคำเตือนใน context เดิม |
| `Badge` | label สั้น ๆ และ status |
| `Spinner` | loading ระยะสั้น |
| `Toast` | feedback ชั่วคราวหลัง action |
| `Skeleton` | placeholder ระหว่างโหลดข้อมูล |
| `EmptyState` | ไม่มีข้อมูลหรือยังไม่มี resource |
| `ResultState` | success, error หรือ result ที่ต้องทำ action ต่อ |
| `Progress` | แสดงความคืบหน้า |
| `LoadingOverlay` | ล็อกและแสดง loading บนพื้นที่ content |

## Content

| Component | ใช้สำหรับ |
|---|---|
| `Card` | grouping ของ content ที่เกี่ยวข้องกัน |
| `Avatar` | identity ของ user หรือ entity |
| `Divider` | แบ่งกลุ่ม content |

## Navigation

| Component | ใช้สำหรับ |
|---|---|
| `Breadcrumb` | แสดงตำแหน่งปัจจุบันใน hierarchy |
| `Tabs` | สลับมุมมองใน context เดียวกัน |
| `Pagination` | เปลี่ยนหน้าของ collection |
| `Sidebar` | navigation หลักของ application shell |
| `NavigationMenu` | เมนู navigation แบบขยายหรือยุบได้ |
| `PageHeader` | title, description และ actions ของหน้า |
| `Toolbar` | รวม filter และ actions ที่เกี่ยวข้อง |
| `SplitPane` | แบ่งพื้นที่หลัก/รายละเอียด |
| `Stepper` | แสดงขั้นตอนของ workflow |
| `Timeline` | แสดงลำดับเหตุการณ์ |

## Overlays และ disclosure

| Component | ใช้สำหรับ |
|---|---|
| `Dialog` | modal interaction ที่ต้องตัดสินใจหรือกรอกข้อมูล |
| `Popover` | content ชั่วคราวที่ผูกกับ trigger |
| `Accordion` | เปิด/ปิด content หลาย section |

## Data display

| Component | ใช้สำหรับ |
|---|---|
| `DataTable` | ตารางข้อมูล typed พร้อม sorting, filtering, pagination และ selection |

## Component page template

ทุกหน้า component ในเว็บ docs ควรมีลำดับนี้:

1. ชื่อและคำอธิบายสั้น ๆ ว่าใช้เมื่อใด
2. Live example จาก Storybook หรือ playground
3. Import snippet
4. Props และ type ที่ export
5. States: default, hover, focus, disabled, loading, error หรือ empty ตามความเหมาะสม
6. Accessibility notes
7. Do / Don't ที่ช่วยให้เลือก composition ได้ถูกต้อง

## DataTable contract

`DataTable<T>` รับ `data: readonly T[]` และรองรับ `columns`, `getRowId`, `caption`,
`showFilters`, `initialSort`, pagination, selection, loading, error และ retry

```tsx
<DataTable
  data={members}
  caption="Members"
  selectable
  onSelectionChange={(rowIds) => saveSelection(rowIds)}
/>
```

เมื่อใช้ custom columns ให้ระบุ `id`, `header` และ `accessor` หรือ `cell` ให้ครบ
และรักษา row id ให้ stable เสมอ
