# Orizz RS website content

เอกสารนี้เป็น copy ตั้งต้นสำหรับเว็บไซต์หลักของ Orizz RS ซึ่งสามารถแยกเป็น landing
page หรือเชื่อมจากหน้า component docs ได้

## Hero

### หัวข้อ

สร้างระบบงานที่ชัดเจนขึ้น ด้วยโครงสร้างที่ทีมไว้ใจได้

### คำอธิบาย

Orizz RS สร้างเครื่องมือและพื้นฐานซอฟต์แวร์สำหรับผลิตภัณฑ์ที่ต้องทำงานจริงในทุกวัน
ตั้งแต่ design system, reusable components ไปจนถึง workflow สำหรับระบบธุรกิจ

### Actions

- สำรวจ component library
- อ่านแนวทางของ Orizz

## What we build

### Product foundations

พื้นฐานที่ช่วยให้ทีมสร้าง application ได้เร็วขึ้น โดยยังคงความสม่ำเสมอของ UI,
accessibility และการดูแลระยะยาว

### ERP-ready experiences

เครื่องมือสำหรับหน้าข้อมูลจำนวนมาก, แบบฟอร์มธุรกรรม, approval workflow และ
application shell ที่ขยายต่อได้ตาม domain ของแต่ละผลิตภัณฑ์

### Calm, clear interfaces

เราเชื่อว่า software ที่ดีควรลดความสับสน ไม่เพิ่มภาระทางความคิด และทำให้ action
ถัดไปชัดเจนตั้งแต่ครั้งแรกที่เปิดหน้าจอ

## Engineering principles

- ใช้ typed API และ contract ที่ตรวจสอบได้
- ออกแบบจาก semantic tokens เพื่อรองรับหลาย theme
- ใช้ native semantics และ accessibility เป็นค่าเริ่มต้น
- แยก reusable foundation ออกจาก business-specific composition
- ตรวจสอบด้วย lint, typecheck, unit test และ package build ก่อน release

## About Orizz UI

`@orizz-rs/ui` คือ shared React component library ของ Orizz products มี component
สำหรับ action, form, feedback, content, navigation, overlay และ data display
รองรับ React 18–19 และเผยแพร่ภายใต้ MIT license

## Footer copy

Orizz RS — clear systems for work that matters.

