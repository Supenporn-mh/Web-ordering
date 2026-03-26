# UI Specification (Mobile-First)
## System: Web Ordering Portals (Customer View)

### 1. Global Viewport & Layout
- **Design Philosophy**: Mobile-First, รันบนเว็บเบราว์เซอร์แต่ให้หน้าตาเหมือน Native App
- **Layout Structure**: 
  - Max Width: 480px สำหรับ Desktop View (โชว์แบบแนวตั้งกึ่งกลางจอ)
  - 100% Width สำหรับ Mobile View
- **Safe Area**: รองรับ Safe area สำหรับ iOS notch และ Home Indicator (bottom)

### 2. Page & Component Structure

#### 2.1 Authentication (Login / Register)
- **State: Initial**:
  - โลโก้แบรนด์อยู่กึ่งกลาง
  - Text input (รหัสประเทศ +66 | เบอร์โทรศัพท์) 
  - ปุ่ม "Continue / ดำเนินการต่อ" (Primary Button)
  - ด้านล่างสุดมีลิงก์ "ยังไม่มีบัญชีใช่หรือไม่? สมัครสมาชิก (Register)"
- **State: OTP Verification**:
  - โชว์เบอร์โทรที่รับ SMS
  - ช่องกรอก OTP 6 หลัก แบบแยกกล่อง (Separate Inputs) หรือ Auto-Focus ทีละกล่อง
  - ข้อความนับเวลาถอยหลัง 05:00 (Resend OTP ในกรณีหมดเวลา)
- **State: Register Form**:
  - Input: ชื่อ-นามสกุล (Required), Email (Optional)

#### 2.2 Branch Selection
- **Header**: "กรุณาเลือกสาขา" ไร้ปุ่ม Back
- **List Item**: 
  - การ์ดสาขา ประกอบด้วย: ชื่อสาขา, สถานะเปิด/ปิด, ระยะทาง (ถ้ามี), เวลาเปิดทำการ
  - ถ้าสาขาปิด ให้สลัวการ์ด (Opacity 50%) ปิดการคลิด

#### 2.3 Menu Listing
- **Header**: รวบยอดรูปภาพสาขา ข้อมูลสาขาแบบย่อ
- **Category Tabs (Sticky)**: เลื่อนซ้ายขวา (Horizontal Scroll) เลือกหมวดหมู่อาหาร
- **Menu Card (Vertical List)**:
  - ภาพอาหารฝั่งซ้าย (Aspect 1:1) / ข้อมูลฝั่งขวา
  - ชื่อเมนู, ราคา, Description คร่าวๆ
  - ปุ่มกด [+] หรือ แจ้งเตือนสถานะ "Out of Stock" แปะทับรูปภาพ
- **Bottom Navigation / Floating Cart**:
  - แถบลอยด้านล่างโชว์ "View Cart (2) | ฿250"

#### 2.4 Menu Detail & Add-on (Bottom Sheet / Modal)
- **Hero Image**: ภาพอาหารด้านบนเต็มความกว้างขอบจอ
- **Section: รายละเอียด**: ชื่อ ราคา
- **Section: Add-ons (ตัวเลือกเสริม)**:
  - Required (บังคับเลือก 1 ช้อยส์) -> แสดงแบบ Radio Button (วงกลม)
  - Optional (เลือกหลายช้อยส์) -> แสดงแบบ Checkbox (สี่เหลี่ยม)
- **Section: Note**: Text Area สำหรับระบุหมายเหตุ ("ไม่ใส่ผักชี, ขอช้อนส้อม")
- **Footer (Sticky)**: ปุ่ม "Add to Cart - [Total Price]" (ถ้าช้อยส์ Required ยังไม่ครบ ปุ่มจะเป็น Disabled State)

#### 2.5 Cart & Checkout
- **Cart View**: 
  - แถวการ์ดสินค้าย่อส่วน มีปุ่ม `[ - ] [ 1 ] [ + ]` และปุ่ม ถังขยะ (Delete)
  - ยอดรวม Subtotal และ Service/Tax
- **Delivery Configuration**:
  - Segment Control `[ ส่งถึงที่ (Delivery) | รับที่ร้าน (Pick-up) ]`
  - *If Delivery (Tab)*:
    - Input Address (Text area)
    - Input Room No. (Text)
    - Input HN (Text)
  - *If Pick-up (Tab)*:
    - Radio Options `( รับทันที | เลือกเวลา )`
- **Payment Methods List**: 
  - List รวม 10 โลโก้ชำระเงิน (คลิกเลือกเป็น Radio-like selection)
- **Footer**: "Confirm Order - [Final Price]"

#### 2.6 Order Success
- **Animation**: Lottie (ติ๊กถูกสีเขียว)
- **Order Card**:
  - Order ID: #WO-12345
  - ยอดชำระ และ วิธีการชำระ
  - กำหนดเวลาจัดส่ง/รับของ
  - สถานะ "Pending / Paid"
- **Action**: ปุ่ม "กลับหน้าแรก (Back to Branch/Menu)"
