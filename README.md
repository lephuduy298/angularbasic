# User Management System

Ứng dụng quản lý Users với Angular và RESTful API Backend.

## 🎯 Tính năng chính

- ✅ **Authentication & Authorization**: Login với JWT token
- ✅ **User Management**: CRUD đầy đủ cho users
- ✅ **RESTful API**: Kết nối với backend qua HTTP
- ✅ **Responsive UI**: Giao diện đẹp với Tailwind CSS

## 🚀 Quick Start

### Cài đặt

```bash
npm install
```

### Cấu hình Backend URL

Sửa file `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080' // URL backend của bạn
};
```

### Chạy ứng dụng

```bash
ng serve
```

Truy cập: `http://localhost:4200/`

## 📊 User Model

```json
{
  "userName": "buiquangh",
  "fullName": "Bùi Quang H",
  "email": "buiquangh@example.com",
  "age": 25,
  "dateOfBirth": "1998-04-05",
  "phoneNumber": "0886677889",
  "role": "admin"
}
```

## 📋 API Endpoints

Backend cần implement các endpoints sau:

- `POST /api/v1/user/login` - Đăng nhập
- `GET /api/v1/user` - Lấy danh sách users
- `GET /api/v1/user/{userName}` - Lấy user theo username
- `POST /api/v1/user` - Tạo user mới
- `PUT /api/v1/user/{userName}` - Cập nhật user
- `DELETE /api/v1/user/{userName}` - Xóa user

## 🎨 Routes

- `/` → Redirect to `/home`
- `/home` - Public homepage
- `/login` - Login page
- `/admin` - Admin panel (requires authentication)
  - `/admin/users` - User management (CRUD)

## 🔧 Tech Stack

- **Angular 19** - Frontend framework
- **Tailwind CSS** - Styling
- **RxJS** - Reactive programming
- **TypeScript** - Type safety
- **RESTful API** - Backend communication

## 📚 Documentation

- [USER_MANAGEMENT_README.md](./USER_MANAGEMENT_README.md) - Chi tiết về User Management
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API Documentation đầy đủ
- [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md) - Hướng dẫn tích hợp backend

## 🛠️ Build & Deploy

### Build for production
```bash
ng build --configuration production
```

### Run tests
```bash
ng test
```

## 📝 Lưu ý

- **Chỉ quản lý User** - Không có Student hoặc model khác
- **Backend URL mặc định**: `http://localhost:8080`
- **JWT Token**: Tự động gửi trong header nếu có
- **No frontend security**: Backend tự do implement security

## 🐛 Troubleshooting

### CORS Error
Đảm bảo backend enable CORS cho `http://localhost:4200`

### Connection Refused
Kiểm tra backend đang chạy trên port 8080

Chi tiết troubleshooting: [USER_MANAGEMENT_README.md](./USER_MANAGEMENT_README.md)

## 📄 License

Educational purposes only.
