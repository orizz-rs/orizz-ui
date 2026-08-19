# Design system

## หลักการ

- **Clear by design** — hierarchy และ next action ต้องเข้าใจได้โดยไม่ต้องอ่านคำอธิบายยาว
- **Green by purpose** — ใช้สีเขียวเพื่อเน้น action หรือ state สำคัญ ไม่ใช้เป็นพื้นหลังทุกส่วน
- **Accessible by default** — keyboard, focus, screen reader, zoom และ reduced motion ต้องใช้งานได้
- **Built from tokens** — component ใช้ semantic token ไม่ hard-code สีตาม theme

## 60 / 30 / 10

- 60%: background และพื้นที่ว่าง
- 30%: surface เช่น card, panel และ navigation
- 10%: brand accent เช่น primary action, link และ focus

## Theme tokens ที่ใช้บ่อย

```css
--orizz-color-background
--orizz-color-surface
--orizz-color-surface-raised
--orizz-color-brand
--orizz-color-brand-hover
--orizz-color-text
--orizz-color-text-muted
--orizz-color-border
--orizz-color-focus
```

ใช้ semantic token ใน component เสมอ:

```css
.action {
  color: var(--orizz-color-on-brand);
  background: var(--orizz-color-brand);
}
```

## Typography และ spacing

ใช้ Bai Jamjuree ผ่าน `--orizz-font-sans`; code และ token name ใช้
`--orizz-font-mono` ใช้ `rem` สำหรับ type, spacing, radius และ control height
โดยยึด spacing base 4 (`--orizz-space-1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`)

## Accessibility checklist

- interactive element ต้องมี accessible name
- focus state ต้องมองเห็นได้ชัดและไม่ใช้สีเป็นสัญญาณเดียว
- ใช้ semantic HTML ก่อนสร้าง ARIA เพิ่ม
- dialog ต้องรองรับ Escape และคืน focus ให้ trigger
- icon ที่ไม่ใช่ content ต้องมี `aria-hidden="true"`
- animation ต้องเคารพ `prefers-reduced-motion`

