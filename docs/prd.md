# Product Requirements Document (PRD)

## Epic: Web Ordering System
**Primary User Role:** Customer

### 1. Registration (สมัครสมาชิก)
**User Story**: As a customer, I want to register using my phone number so that I can place orders easily.
**Acceptance Criteria**:
- ระบบชี้เป้าหมายเริ่มต้นที่เมนู Login เสมอ และมี Text Link/ปุ่ม "Register" อยู่ด้านล่าง
- ผู้ใช้กรอกเบอร์โทร → ระบบส่ง OTP (อายุ 5 นาที)
- หากเบอร์โทรเคยลงทะเบียนแล้ว ระบบจะฟ้องว่าเคยมีบัญชีแล้ว ไม่สามารถลงทะเบียนซ้ำได้
- หากลูกค้าไม่เคยสมัคร จะไม่สามารถ Login ได้ ต้องมาทาง Register เท่านั้น
- ผู้ใช้กรอก OTP
  - OTP ถูกต้อง: ให้กรอกชื่อ (Required) และ Email (Optional)
  - OTP ผิด: แสดง error message
- เมื่อสมัครสำเร็จ: ระบบสร้าง account และทำ Auto-login

### 2. Login (เข้าสู่ระบบ)
**User Story**: As a customer, I want to login using my phone number so that I can access my account.
**Acceptance Criteria**:
- ผู้ใช้กรอกเบอร์โทรที่เคยสมัครแล้ว → ระบบส่ง OTP (อายุ 5 นาที)
- หากเบอร์ยังไม่เคยลงทะเบียน ระบบต้องแสดง Error พร้อมแนะนำให้หน้า Register
- กรอก OTP ถูกต้อง → Login สำเร็จ
- กรอก OTP ผิด → แสดง error

### 3. Branch Selection (เลือกสาขา)
**User Story**: As a customer, I want to choose a branch so that I can see available menus.
**Acceptance Criteria**:
- แสดงรายการสาขาทั้งหมดที่มีในระบบ
- ลูกค้าเลือกได้ 1 สาขาในแต่ละ Session
- เมื่อเลือกแล้ว ระบบจะโหลดข้อมูลและจำกัดเมนูอาหารให้ตรงกับสาขานั้น

### 4. Menu Listing (รายการอาหาร)
**User Story**: As a customer, I want to view menu items so that I can select food.
**Acceptance Criteria**:
- แสดงผลรายการอาหาร ประกอบด้วย: ชื่อเมนู, ราคา, รูปภาพ, หมวดหมู่ (Category)
- ลูกค้าสามารถเลื่อน (scroll/browse/filter) รายการอาหารได้
- หากเมนูรายการใดหมด: ต้องแสดง Overly/Text ทับว่า “Out of Stock” และปิดปุ่มกด

### 5. Menu Detail + Add-on
**User Story**: As a customer, I want to customize my menu so that it matches my preference.
**Acceptance Criteria**:
- ลูกค้ากดดูรายละเอียดของเมนู
- แสดงข้อมูล: ภาพ, รายละเอียดเมนูแบบเต็ม, ตัวเลือกช้อยส์เสริมและ Add-on 
- ลูกค้าสามารถเลือก Add-on และพิมพ์หมายเหตุเพิ่มเติม (Note) ให้ทางร้านได้
- หากมี Option ที่ตั้งเป็น `Required` (บังคับเลือก) จะต้องเลือกก่อนจึงจะกด “Add to Cart” ได้

### 6. Cart (ตะกร้าสินค้า)
**User Story**: As a customer, I want to review my cart so that I can confirm my order.
**Acceptance Criteria**:
- แสดงรายการสินค้าทั้งหมดที่เตรียมจะสั่ง
- ข้อมูลที่แสดงต่อชิ้น: ชื่อ, ราคาต่อชิ้น, จำนวน, และ Add-on ที่เลือก
- ผู้ใช้สามารถแก้ไขจำนวน (+/-) หรือกดลบรายการทิ้งได้
- ท้ายสุดแสดงสรุปยอดรวม (Total amount)
- ผู้ใช้กด “Proceed / ดำเนินการต่อ” ไปยังขั้นตอนการระบุข้อมูลจัดส่ง

### 7. Delivery Information (ข้อมูลการรับสินค้า)
**User Story**: As a customer, I want to provide delivery or pickup details so that I can receive my order.
**Acceptance Criteria**:
- **7.1 ข้อมูลบังคับร่วม (Common)**: ระบบจะดึงค่าตั้งต้นมา แต่ให้ใส่/แก้ไข ชื่อผู้รับ และ เบอร์โทร ได้
- **7.2 จัดส่ง (Delivery)**:
  - Text field กรอกที่อยู่หลัก
  - Text field สำหรับกรอก ห้อง (Room Number)
  - Text field สำหรับกรอก HN (Hospital Number)
- **7.3 รับที่ร้าน (Pick-up)**:
  - ตัวเลือกว่าจะ "รับทันที" หรือ "เลือกระบุเวลา"
  - หากเลือกระบุเวลา: สามารถเลื่อนเวลาได้เฉพาะในไทม์โซนที่เวลาทำการ (Operating Hours) อนุญาต

### 8. & 9. Payment Option and Methods (ตัวเลือกและการชำระเงิน)
**User Story**: As a customer, I want to choose a payment method so that I can complete my order.
**Acceptance Criteria**:
- ระบบมีช่องทางการชำระ (10 ช่องทาง) แสดงให้ลูกค้าเลือก:
  1. เครดิต/เดบิต  2. พร้อมเพย์  3. แม่มณี  4. สมาชิก  5. Truemoney  6. คูปอง  7. เงินสด  8. Room service  9. Alipay  10. Wechat Pay
- การชำระแบบ **Pay Later** (เช่น 7. เงินสด, 8. Room Service): ให้ข้ามไปหน้า Order Success ได้ทันที
- การชำระแบบ **Pay Now** (เช่น บัตร, พร้อมเพย์, Wallet ต่างๆ): ระบบต้องส่งตัวแปรทำ Payment Flow ร่วมกับ Gateway ให้สำเร็จ ก่อนจึงจะมาสร้าง Order Success ได้

### 10. Order Success (สถานะการสั่งซื้อ)
**User Story**: As a customer, I want to see order confirmation so that I know my order is successful.
**Acceptance Criteria**:
- หน้าจอแสดงขอบคุณ และแสดงรายละเอียด Order ID, รายการอาหาร, ยอดชำระรวม, ประเภทรับสินค้า (Room, HN), เวลาที่คาดว่าจะได้รับ
- ระบบทำการส่ง payload ให้ Backend บันทึกข้อมูล Order ลงฐานข้อมูล
- สถานะ Order แรกเริ่มจะเป็น “Pending” (สำหรับ Pay Later) หรือ “Paid” (สำหรับ Pay Now ที่จ่ายแล้ว)

### Business Rules Summary (กฏเกณฑ์เชิงธุรกิจ)
- 1 Phone number = 1 Account
- OTP timeout = 5 นาที
- ชุดข้อมูล Menu และ เวลาเปืด-ปิด ขึ้นอยู่กับฝั่ง Branch
- Add-on ต้องผูกโยงกับ Menu เท่านั้น
