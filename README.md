# PawnManager - Hệ Thống Quản Lý Cầm Đồ

Hệ thống quản lý cầm đồ chuyên nghiệp được xây dựng trên nền tảng web hiện đại, giúp quản lý hợp đồng, khách hàng, lãi suất và tài sản một cách tối ưu và chính xác.

## 🚀 Công Nghệ Sử Dụng

- **Frontend**: Vue 3 (Composition API), Pinia (State Management), Vite, Bootstrap 5.
- **Backend**: Node.js, Express.
- **Database**: SQLite (qua thư viện `better-sqlite3`).
- **Khác**: `dayjs` (xử lý ngày tháng), `v-money3` (định dạng tiền tệ), `concurrently`.

## 📦 Cài Đặt

1. **Clone project**:
   ```sh
   git clone <repository-url>
   cd PawnManager
   ```

2. **Cài đặt dependencies**:
   ```sh
   npm install
   ```

3. **Cấu hình môi trường**:
   - Tạo file `.env` trong thư mục `backend/`.
   - Cấu hình các biến môi trường cần thiết (PORT, JWT_SECRET, v.v.).

## 🖥️ Chạy Dự Án

Sử dụng lệnh sau để chạy đồng thời cả Frontend và Backend ở chế độ phát triển:

```sh
npm run dev
```

- **Frontend**: Chạy tại `http://localhost:5173`
- **Backend**: Chạy tại `http://localhost:3000`

## ✨ Các Tính Năng Chính

1. **Quản Lý Hợp Đồng**:
   - Tạo mới hợp đồng (Cầm đồ, Tín chấp, Trả góp).
   - Tự động tính toán lịch trả lãi/gốc.
   - Tự động tính toán tiền lãi/gốc còn lại.
   - Hỗ trợ nhiều định kỳ trả lãi (Ngày, Tháng).
   - In hợp đồng, phiếu thu, phiếu chi.

2. **Quản Lý Tài Sản (Collaterals)**:
   - Tự động cấp mã tài sản (TSxxxxx).
   - Tải lên nhiều ảnh cho tài sản thế chấp.
   - Theo dõi trạng thái tài sản (Đang cầm, Đã chuộc, Đã thanh lý).
   - Tính năng **Thanh lý tài sản** khi hợp đồng quá hạn.

3. **Giao Dịch & Tài Chính**:
   - Đóng lãi định kỳ.
   - Trả bớt gốc (tự động tính lại lịch trả lãi cho dư nợ còn lại).
   - Tất toán hợp đồng trước hạn.

4. **Khách Hàng**:
   - Quản lý thông tin khách hàng và người thân.
   - Theo dõi lịch sử giao dịch của từng khách hàng.

5. **Nhân Viên**:
   - Quản lý thông tin nhân viên.
   - Phân quyền nhóm nhân viên nâng cao.

6. **Quản Lý Thu Chi**:
   - Quản lý thu chi.

7. **Báo Cáo**:
   - Báo cáo doanh thu.
   - Báo cáo chi phí.
   - Báo cáo lợi nhuận.
   - Báo cáo tài sản.
   - Báo cáo khách hàng.
   - Báo cáo thu chi.

## 📂 Cơ Cấu Thư Mục

- `src/`: Mã nguồn Frontend (Vue components, stores, views).
- `backend/`: Mã nguồn Backend (Controllers, Models, Routes, Data).
- `public/`: Các tài nguyên công khai và file upload.

---
© 2026 PawnManager System MADE BY NGUYEN HAI HA.