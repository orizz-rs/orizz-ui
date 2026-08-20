# Orizz RS Docs

เอกสารชุดนี้เป็น source of truth สำหรับเว็บไซต์ documentation ของ Orizz RS และ
แพ็กเกจ `@orizz-rs/ui` โดยตั้งใจให้ย้ายไปใช้กับ VitePress, Astro Starlight,
Docusaurus หรือระบบ docs อื่นได้โดยไม่ต้องผูกกับ framework ใด framework หนึ่ง

## โครงสร้างเอกสาร

- [Getting started](./getting-started.md) — ติดตั้ง package, theme และตัวอย่างการใช้งาน
- [Components](./components.md) — catalog ของ component ที่ export จาก package
- [Design system](./design-system.md) — หลักการสี, token, typography และ accessibility
- [Orizz RS website content](./website-content.md) — copy และโครงสร้างหน้าสำหรับเว็บไซต์หลัก

## ข้อมูลสำคัญ

- Package: `@orizz-rs/ui`
- Current version: `0.2.0`
- License: MIT
- React support: `>=18.2.0 <20`
- Themes: `light`, `dark` และ system preference
- Component exports: 42

## เส้นทางแนะนำสำหรับเว็บ docs

```text
/
├── Introduction
├── Getting started
├── Foundations
│   ├── Design principles
│   ├── Color and themes
│   ├── Typography
│   └── Accessibility
├── Components
│   ├── Actions
│   ├── Forms
│   ├── Feedback
│   ├── Content
│   ├── Navigation
│   ├── Overlays
│   └── Data display
└── Orizz RS
    ├── About
    ├── Products
    └── Engineering principles
```

ตัวอย่างใน playground และ Storybook ควรใช้เป็น live demo ของหน้า component
ส่วนไฟล์ใน `docs/` ใช้เป็นเนื้อหา, contract และ narrative หลัก
