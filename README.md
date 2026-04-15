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

### Development Mode
Chạy cả Frontend, Backend và Electron app cùng lúc:
```sh
npm run electron:dev
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`
- **Database**: `backend/data/pawn.db`

### Build Electron App (.exe)
```sh
npm run electron:build:win
```
- Tạo file .exe tại `dist-electron/`
- Database sẽ được lưu tại: `C:\Users\[User Name]\AppData\Roaming\PawnManager\data\pawn.db`
- ✅ Dữ liệu **sẽ được giữ nguyên** khi cập nhật app

- Tự động build và upload lên GitHub Releases
- App sẽ tự kiểm tra cập nhật khi khởi động

## ✨ Các Tính Năng Chính

1. **Quản Lý Hợp Đồng**:
   - Tạo mới hợp đồng (Cầm đồ, Tín chấp, Trả góp).
   - Tự động tính toán lịch trả lãi/gốc theo công thức.
   - Tự động tính toán tiền lãi/gốc còn lại.
   - Hỗ trợ nhiều định kỳ trả lãi (Ngày, Tháng).
   - In hợp đồng, phiếu thu, phiếu chi (với mẫu custom).
   - Xem & quản lý lịch sử hợp đồng.

2. **Quản Lý Tài Sản (Collaterals)**:
   - Tự động cấp mã tài sản (TSxxxxx).
   - Tải lên nhiều ảnh cho tài sản thế chấp.
   - Theo dõi trạng thái tài sản (Đang cầm, Đã chuộc, Đã thanh lý).
   - Tính năng **Thanh lý tài sản** khi hợp đồng quá hạn.
   - Mô tả chi tiết tài sản (kích thước, màu sắc, v.v.).

3. **Giao Dịch & Tài Chính**:
   - Đóng lãi định kỳ.
   - Trả bớt gốc (tự động tính lại lịch trả lãi cho dư nợ còn lại).
   - Tất toán hợp đồng trước hạn.
   - Quản lý loại giao dịch custom.
   - Theo dõi lịch sử tất cả giao dịch.

4. **Khách Hàng**:
   - Quản lý thông tin khách hàng (CMND/CCCD, SĐT, địa chỉ).
   - Lưu thông tin người thân (liên lạc khi cần).
   - Xem toàn bộ lịch sử giao dịch của từng khách hàng.
   - Tìm kiếm nhanh khách hàng theo SĐT hoặc CMND.

5. **Nhân Viên & Phân Quyền**:
   - Quản lý thông tin nhân viên.
   - Phân quyền chi tiết (roles & permissions).
   - Theo dõi người dùng nào thực hiện giao dịch nào.
   - Các quyền hạn: read, create, update, delete, print, final_settlement, v.v.

6. **Quản Lý Thu Chi**:
   - Quản lý các loại giao dịch thu/chi.
   - Theo dõi chi tiết từng giao dịch.
   - Báo cáo tổng hợp thu chi theo kỳ.

7. **In Tài Liệu & Mẫu**:
   - 📄 **Quản Lý Mẫu**: Upload & quản lý nhiều mẫu in (hợp đồng, phiếu thu).
   - 🔄 **In Linh Hoạt**: Chọn mẫu khác nhau khi in.
   - 📋 **Hỗ Trợ Multiple Templates**: Một loại tài liệu có thể có nhiều mẫu.
   - ✏️ **Quản Lý Template**: Thêm, sửa, xóa mẫu tại **Cấu Hình Hệ Thống → Quản Lý Mẫu**.

8. **Cập Nhật Thông Tin Bằng Cấp**:
   - 🎓 Quản lý **Giấy Phép/Bằng Cấp** của nhân viên.
   - 📅 Tracking ngày cấp & ngày hết hạn.
   - ⚠️ **Cảnh báo tự động** khi bằng gần hết hạn.
   - 📝 Lưu trữ bằng cấp từng nhân viên.

9. **Sao Lưu & Khôi Phục Dữ Liệu**:
   - 💾 **Backup Tự Động**: Mỗi giờ app sẽ tự động backup database.
   - 📁 **Vị Trí Backup**: `C:\Users\[User]\AppData\Roaming\PawnManager\backup\`
   - 🔄 **Khôi Phục**: Có thể khôi phục từ backup cũ nếu cần.
   - ✅ **Đảm Bảo An Toàn**: Không bao giờ mất dữ liệu khi cập nhật app.

10. **Cấu Hình Hệ Thống**:
   - ⚙️ Quản lý loại tài sản.
   - ⚙️ Quản lý loại hợp đồng.
   - ⚙️ Quản lý mẫu in tài liệu.
   - ⚙️ Quản lý vai trò & quyền hạn.
   - ⚙️ Quản lý cài đặt hệ thống.

11. **Nhật Ký Hoạt Động**:
   - 📋 **Audit Logs**: Lưu lại tất cả hành động của người dùng.
   - 👤 Theo dõi ai tạo/sửa/xóa dữ liệu.
   - 📅 Timestamp chính xác mỗi hành động.
   - 🔍 Tìm kiếm & lọc logs chi tiết.

12. **Tự Động Cập Nhật**:
   - 🔄 **Auto Update**: App tự kiểm tra cập nhật khi khởi động.
   - 📥 **1-Click Update**: Tải & cài đặt bản mới chỉ với vài click.
   - ✅ **Không Mất Dữ Liệu**: Dữ liệu được giữ nguyên qua cập nhật.
   - 🔔 **Thông Báo**: Hiển thị trạng thái tải xuống & tiến độ.

## 📂 Cơ Cấu Thư Mục

- `src/`: Mã nguồn Frontend (Vue components, stores, views).
- `backend/`: Mã nguồn Backend (Controllers, Models, Routes, Data).
- `public/`: Các tài nguyên công khai và file upload.

---

## 🔧 Hướng Dẫn Sử Dụng & Troubleshooting

### Cài Đặt Lần Đầu
**Cho người dùng cuối:**
1. Tải file `PawnManager Setup x.x.x.exe` mới nhất từ [GitHub Releases](https://github.com/Nguyen-Hai-Ha/PawnManager/releases)
2. Chạy file .exe và làm theo hướng dẫn cài đặt
3. App sẽ tự tạo database trên lần khởi động đầu tiên
4. Đăng nhập với tài khoản quản trị

### Cập Nhật Phiên Bản Mới
- App sẽ **tự động kiểm tra cập nhật** khi khởi động
- Khi có bản cập nhật mới, bạn sẽ thấy thông báo "Có bản cập nhật mới!"
- Chọn "Tải xuống" → App sẽ download bản mới
- Chọn "Khởi động lại ngay" → App sẽ cài đặt và khởi động lại
- ✅ **Dữ liệu cũ sẽ được giữ nguyên** (database nằm độc lập)

### Quản Lý Dữ Liệu

#### Sao Lưu Dữ Liệu (Backup)
- **Tự Động Backup**: 
  - App tự động backup **mỗi 1 giờ**
  - Không cần cấu hình, chạy tự động ở background

- **Vị Trí Backup**:
  ```
  C:\Users\[User Name]\AppData\Roaming\PawnManager\backup\
  ```

- **File Backup**:
  ```
  pawn_backup_2026-04-15_14-30-45.db
  ```

- **Khôi Phục Từ Backup** (nếu cần):
  1. Đóng app hoàn toàn
  2. Mở Windows Explorer → `AppData\Roaming\PawnManager\backup\`
  3. Chọn file backup muốn khôi phục
  4. Copy file đó
  5. Đi tới `AppData\Roaming\PawnManager\data\`
  6. Paste và rename thành `pawn.db`
  7. Khởi động lại app

#### Reset Database (Xóa Sạch Dữ Liệu)
⚠️ **Cảnh báo**: Thao tác này sẽ **xóa tất cả dữ liệu** - không thể khôi phục!

1. Điều hướng tới: `C:\Users\[User Name]\AppData\Roaming\PawnManager\`
2. **Xóa folder `data`** (hoặc chỉ xóa file `data/pawn.db`)
3. Khởi động lại app
4. App sẽ **tự tạo database mới trắng**
5. Tạo lại tài khoản quản trị & bắt đầu từ đầu

### Yêu Cầu Hệ Thống
- **OS**: Windows 7 trở lên (khuyến nghị Windows 10+)
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB+)
- **Ổ cứng**: 400MB cho app + 100MB cho dữ liệu ban đầu
- **Internet**: Cần kết nối để kiểm tra cập nhật (không bắt buộc)
- **Màn hình**: Độ phân giải tối thiểu 1366x768

---

---
© 2026 PawnManager System MADE BY NGUYEN HAI HA.
