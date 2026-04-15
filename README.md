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

### Publish Update (GitHub Release)
```sh
$env:GH_TOKEN="your_github_token"
npm run electron:publish
```
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

### 1. Cài Đặt Lần Đầu
**Cho người dùng cuối:**
1. Tải file `PawnManager Setup x.x.x.exe` mới nhất từ [GitHub Releases](https://github.com/Nguyen-Hai-Ha/PawnManager/releases)
2. Chạy file .exe và làm theo hướng dẫn cài đặt
3. App sẽ tự tạo database trên lần khởi động đầu tiên
4. Đăng nhập với tài khoản quản trị

### 2. Cập Nhật Phiên Bản Mới
- App sẽ **tự động kiểm tra cập nhật** khi khởi động
- Khi có bản cập nhật mới, bạn sẽ thấy thông báo "Có bản cập nhật mới!"
- Chọn "Tải xuống" → App sẽ download bản mới
- Chọn "Khởi động lại ngay" → App sẽ cài đặt và khởi động lại
- ✅ **Dữ liệu cũ sẽ được giữ nguyên** (database nằm độc lập)

### 3. Các Tính Năng In Tài Liệu & Quản Lý Mẫu
#### In Hợp Đồng & Phiếu Thu
- **In Hợp Đồng**: 
  1. Vào **Chi Tiết Hợp Đồng**
  2. Bấm nút **"In"** (hoặc **"In Hợp Đồng"**)
  3. Chọn template mẫu từ danh sách
  4. File Word sẽ được tải xuống tự động

- **In Phiếu Thu**:
  1. Vào **Đóng Lãi** → các lần đóng
  2. Bấm cột **"Các Lần Đóng"** 
  3. Chọn template phiếu thu
  4. File Word sẽ được tải xuống

#### Quản Lý Mẫu In
1. Vào **Cấu Hình Hệ Thống** (menu bên dưới dùng)
2. Chọn **Quản Lý Mẫu**
3. **Thêm Mẫu Mới**:
   - Bấm **"Thêm Template"**
   - Điền tên mẫu (ví dụ: "Hợp Đồng Cầm Đồ - Mẫu A")
   - Chọn loại mẫu (hợp đồng/phiếu thu)
   - Upload file Word (.docx) làm mẫu
   - Bấm **"Lưu"**

4. **Chỉnh Sửa Mẫu**:
   - Bấm nút **"Sửa"** trên mẫu
   - Cập nhật thông tin hoặc upload file mới
   - Bấm **"Cập Nhật"**

5. **Xóa Mẫu**:
   - Bấm nút **"Xóa"** (chỉ có thể xóa nếu không dùng)

6. **Các Biến Có Sẵn Trong Template**:
   - **Hợp Đồng**: `{Ma_HD}`, `{Ten_KH}`, `{SDT_KH}`, `{Tien_vay}`, `{Lai_suat}`, v.v.
   - **Phiếu Thu**: `{Ten_KH}`, `{Tien_thu}`, `{Tien_thu_bang_chu}`, `{Ngay_thu}`, v.v.

### 4. Quản Lý Dữ Liệu

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

#### Export Dữ Liệu (Báo Cáo)
- **Export Báo Cáo**:
  1. Vào module **Báo Cáo**
  2. Chọn loại báo cáo (doanh thu, chi phí, v.v.)
  3. Chọn khoảng thời gian
  4. Bấm **"Export Excel"** hoặc **"Export PDF"**
  5. File sẽ được tải xuống

#### Reset Database (Xóa Sạch Dữ Liệu)
⚠️ **Cảnh báo**: Thao tác này sẽ **xóa tất cả dữ liệu** - không thể khôi phục!

1. Điều hướng tới: `C:\Users\[User Name]\AppData\Roaming\PawnManager\`
2. **Xóa folder `data`** (hoặc chỉ xóa file `data/pawn.db`)
3. Khởi động lại app
4. App sẽ **tự tạo database mới trắng**
5. Tạo lại tài khoản quản trị & bắt đầu từ đầu

### 5. Quản Lý Nhân Viên & Bằng Cấp

#### Cập Nhật Thông Tin Bằng Cấp
1. Vào **Quản Lý Nhân Viên**
2. Chọn nhân viên cần update
3. Tab **"Thông Tin Bằng Cấp"**
4. Bấm **"Thêm Bằng Cấp"**:
   - Chọn loại bằng (Bằng cấp, Chứng chỉ, Giấy phép, v.v.)
   - Điền tên bằng (VD: "Bằng Lái xe hạng B")
   - Ngày cấp
   - Ngày hết hạn
   - Số hiệu bằng (tùy chọn)
   - Upload ảnh bằng (tùy chọn)
   - Bấm **"Lưu"**

5. **Cảnh báo Hết Hạn**:
   - Khi bằng còn **30 ngày** → Hiển thị cảnh báo vàng
   - Khi bằng **hết hạn** → Hiển thị cảnh báo đỏ
   - Dashboard sẽ show số lượng bằng cấp sắp hết hạn

#### Quản Lý Quyền Hạn (Roles & Permissions)
1. Vào **Cấu Hình Hệ Thống** → **Phân Quyền**
2. **Tạo Vai Trò Mới**:
   - Bấm **"Thêm Vai Trò"**
   - Điền tên vai trò (VD: "Nhân Viên Tài Chính")
   - Chọn quyền hạn (checkboxes)
   - Quyền chính:
     - `loans.read` - Xem & quản lý cầm đồ
     - `loans.print` - In hợp đồng cầm đồ
     - `loans.delete` - Xóa cầm đồ
     - `loans.final_settlement` - Tất toán cầm đồ
     - `repayment.*` - Các quyền trả góp
     - `pledge.*` - Các quyền tín chấp
   - Bấm **"Lưu"**

3. **Gán Vai Trò Cho Nhân Viên**:
   - Vào **Quản Lý Nhân Viên** → Chọn nhân viên
   - Phần **"Vai Trò"** → Chọn từ dropdown
   - Bấm **"Cập Nhật"**

### 5. Gặp Lỗi?

#### Backend không khởi động
- **Hiện tượng**: Không thể kết nối API (Network Error)
- **Giải pháp**:
  1. Đóng app hoàn toàn
  2. Chờ 5 giây
  3. Khởi động lại app
  4. Nếu vẫn lỗi, xóa folder `backend/data/` và khởi động lại

#### Cập nhật không hiển thị
- **Hiện tượng**: App không hiển thị thông báo cập nhật
- **Giải pháp**:
  1. Kiểm tra có bản mới trên [GitHub Releases](https://github.com/Nguyen-Hai-Ha/PawnManager/releases)
  2. Kiểm tra kết nối Internet
  3. Tải bản mới từ GitHub và cài đặt thủ công

#### In tài liệu bị lỗi
- **Hiện tượng**: Không in được hoặc template hiển thị `undefined`
- **Giải pháp**:
  1. Kiểm tra template đã được upload tại **Cấu Hình Hệ Thống**
  2. Chọn lại template khác hoặc tạo mới
  3. Kiểm tra quyền người dùng (Cấu Hình → Phân Quyền)

#### Database bị lỗi hoặc corrupt
- **Hiện tượng**: App khởi động rồi đóng ngay, hoặc lỗi SQL
- **Giải pháp**:
  1. Khôi Phục từ backup (xem mục "Khôi Phục Từ Backup")
  2. Nếu backup cũng lỗi → Reset database (xem mục "Reset Database")

### 6. Kiểm Toán & Xem Nhật Ký Hoạt Động (Audit Logs)
#### Xem Lịch Sử Hoạt Động
1. Vào **Báo Cáo** → **Nhật Ký Kiểm Toán** (hoặc **Audit Logs**)
2. Bạn sẽ thấy danh sách:
   - **Người dùng** - Ai thực hiện hành động
   - **Hành động** - Tạo, sửa, xóa, tất toán
   - **Chi tiết** - Thông tin cụ thể (VD: "Tất toán hợp đồng HD001")
   - **Thời gian** - Ngày & giờ chính xác

3. **Tìm Kiếm**:
   - Lọc theo người dùng
   - Lọc theo loại hành động
   - Lọc theo khoảng thời gian
   - Search theo từ khóa

4. **Export Logs**:
   - Bấm **"Export Excel"** để lưu file
   - Hữu ích cho kiểm toán nội bộ

### 7. Quản Lý Người Dùng & Quyền
- **Tài khoản**: Quản lý tại **Quản Lý Nhân Viên**
- **Phân Quyền**: Tạo vai trò tại **Cấu Hình Hệ Thống → Phân Quyền**
- **Các Quyền Chính**:
  - `loans.read` - Xem danh sách cầm đồ
  - `loans.print` - In hợp đồng cầm đồ
  - `loans.final_settlement` - Tất toán cầm đồ
  - `repayment.read` - Xem danh sách trả góp
  - `pledge.read` - Xem danh sách tín chấp
  - `collateral.liquidation` - Thanh lý tài sản

### 8. Yêu Cầu Hệ Thống
- **OS**: Windows 7 trở lên (khuyến nghị Windows 10+)
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB+)
- **Ổ cứng**: 400MB cho app + 100MB cho dữ liệu ban đầu
- **Internet**: Cần kết nối để kiểm tra cập nhật (không bắt buộc)
- **Màn hình**: Độ phân giải tối thiểu 1366x768

---

## 💡 Tips & Best Practices

### Sử Dụng Hiệu Quả
1. **Backup Thường Xuyên**:
   - Kiểm tra backup folder mỗi tháng
   - Có thể transfer backup để lưu trữ ngoài

2. **Cấu Hình Bằng Cấp**:
   - Nên set ngày hết hạn 30 ngày trước để nhận cảnh báo sớm
   - Tải ảnh bằng gốc lên để có chứng cứ

3. **Sắp Xếp Quyền Hạn**:
   - Nhân viên mới: 2-3 quyền cơ bản (read)
   - Nhân viên cấp cao: thêm quyền tất toán & xóa
   - Quản lý: toàn bộ quyền

4. **In Tài Liệu**:
   - Test in với template mới trước khi dùng chính thức
   - Giữ 1-2 mẫu backup trong cấu hình
   - Cập nhật template khi logo/info công ty thay đổi

5. **Quản Lý Hợp Đồng**:
   - Tạo hợp đồng một lần → dữ liệu sẽ lưu tự động
   - Kiểm tra lịch thanh toán sau khi tạo
   - Test "Trả bớt gốc" trước khi dùng thực tế

---

## ❓ Câu Hỏi Thường Gặp (FAQ)

### Q: Làm sao để biết backup có được lưu không?
**A:** Mỗi giờ app sẽ tạo một file `.db` trong folder `AppData\Roaming\PawnManager\backup\`. Kiểm tra folder này để chắc chắn.

### Q: Nếu xóa nhân viên, dữ liệu giao dịch của họ có bị xóa không?
**A:** Không. Dữ liệu giao dịch vẫn được lưu với tên nhân viên cũ. Bạn chỉ nên "vô hiệu hóa" nhân viên thay vì xóa.

### Q: Làm sao để thay đổi mệnh giá lãi suất khi hợp đồng đang chạy?
**A:** Dùng tính năng **"Trả Bớt Gốc"** - nó sẽ tự động tính lại lãi suất cho dư nợ còn lại. Chi tiết xem phần **"Hướng Dẫn Chi Tiết: Trả Bớt Gốc"** dưới đây.

### Q: Có cách nào tìm nhanh khách hàng không?
**A:** Vào **Quản Lý Khách Hàng** → Tìm kiếm bằng **SĐT** hoặc **CMND/CCCD**. App sẽ tìm kiếm real-time.

### Q: Template in bị lỗi (hiển thị undefined). Phải làm sao?
**A:** 
1. Kiểm tra template Word (.docx) có đúng định dạng không
2. Kiểm tra các biến placeholder: `{Ma_HD}`, `{Ten_KH}`, v.v. có viết đúng không
3. Xóa template cũ, upload mẫu mới

### Q: Quên mật khẩu tài khoản. Phải làm sao?
**A:** Liên hệ quản trị viên hệ thống để reset mật khẩu.

### Q: Cần xuất toàn bộ dữ liệu ra Excel. Làm sao?
**A:** Vào **Báo Cáo** → Chọn loại báo cáo → Bấm **"Export Excel"** để tải xuống.

### Q: Có thể backup & restore dữ liệu từ máy này sang máy khác không?
**A:** Có. Copy file backup từ `AppData\Roaming\PawnManager\backup\` sang máy khác, rồi khôi phục theo hướng dẫn trong mục "Sao Lưu & Khôi Phục".

---

## 📖 Hướng Dẫn Chi Tiết: Trả Bớt Gốc (Giảm Dư Nợ)

Tính năng **"Trả Bớt Gốc"** cho phép khách hàng thanh toán một phần gốc vay sớm. Hệ thống **tự động tính lại lãi** cho dư nợ còn lại.

### Các Bước Thực Hiện

1. **Vào Chi Tiết Hợp Đồng**:
   - Vào module tương ứng (Cầm Đồ / Trả Góp / Tín Chấp)
   - Tìm hợp đồng
   - Bấm để xem chi tiết

2. **Bấm Nút "Trả Bớt Gốc"**:
   - Ở phần footer hoặc trong tab "Giao Dịch"

3. **Điền Thông Tin**:
   - **Ngày Trả**: Ngày thanh toán
   - **Số Tiền**: Số tiền gốc muốn trả
   - **Lãi Suất Mới** (nếu thay đổi): Lãi suất mới
   - **Ghi Chú**: Thông tin thêm (tùy chọn)

4. **Kiểm Tra & Xác Nhận**:
   - App hiển thị gốc cũ/mới, lãi cũ/mới
   - Lịch thanh toán được cập nhật
   - Bấm **"Xác Nhận"**

5. **Kết Quả**:
   - Dư nợ giảm
   - Lãi được tính lại
   - Giao dịch được lưu trong lịch sử

### Ví Dụ Cụ Thể

**Hợp đồng gốc**: 10.000.000 VNĐ  
**Lãi suất**: 10% tháng  
**Kỳ hiện tại**: Tháng 4 (lãi = 1.000.000 VNĐ)  

**Khách trả bớt gốc**: 5.000.000 VNĐ vào ngày 15/4

**Kết quả sau "Trả Bớt Gốc"**:
- Gốc còn lại: 5.000.000 VNĐ
- Lãi tháng 4 (1-15): 500.000 VNĐ  
- Lãi tháng 5 (mới): 500.000 VNĐ (theo gốc mới)
- Lịch thanh toán cập nhật tự động

---

---
© 2026 PawnManager System MADE BY NGUYEN HAI HA.
