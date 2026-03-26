import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Mock Database ---
const orders = [];

// --- APIs ---

// 1. ตรวจสอบระบบ
app.get('/', (req, res) => {
  res.send('Web Ordering API is running!');
});

// 2. ขอ OTP (Auth: Request OTP)
app.post('/api/v1/auth/request-otp', (req, res) => {
  const { phoneNumber } = req.body;
  console.log(`[API] แกล้งส่ง OTP 123456 ไปที่เบอร์: ${phoneNumber}`);
  res.status(200).json({ message: 'OTP sent', referenceNo: 'REF-1122' });
});

// 3. ยืนยัน OTP (Auth: Verify OTP)
app.post('/api/v1/auth/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (otp === '123456') { // Mock ให้ผ่านถ้ารหัส 123456
    res.status(200).json({ isRegistered: true, token: 'mock-jwt-token-wqdasd' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

// 4. บันทึกคำสั่งซื้อ (Create Order)
app.post('/api/v1/orders', (req, res) => {
  const newOrder = {
    id: `WO-${Date.now()}`,
    ...req.body,
    status: 'Pending Payment',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  console.log('[API] ได้รับออร์เดอร์ใหม่:', newOrder);
  res.status(201).json({ orderId: newOrder.id, message: 'Order created successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`✅  Backend API พร้อมใช้งานแล้ว!`);
  console.log(`🚀  เปิดดูได้ที่: http://localhost:${PORT}`);
  console.log(`===========================================\n`);
});
