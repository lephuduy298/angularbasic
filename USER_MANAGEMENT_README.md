# Appointment App - User Management System

Ứng dụng quản lý Users với RESTful API Backend.

## 🎯 Tính năng

- ✅ **Authentication**: Login với username/password
- ✅ **User Management**: CRUD operations cho users với đầy đủ thông tin
  - userName
  - fullName
  - email
  - age
  - dateOfBirth
  - phoneNumber
  - role
- ✅ **RESTful API Integration**: Kết nối với backend qua HTTP
- ✅ **JWT Token Support**: Tự động gửi token trong header
- ✅ **Route Guards**: Bảo vệ các route admin
- ✅ **Responsive UI**: Giao diện đẹp với Tailwind CSS
- ✅ **Search & Pagination**: Tìm kiếm và phân trang users

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Backend URL

Mở file `src/environments/environment.ts` và cập nhật URL backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080' // Thay đổi URL này theo backend của bạn
};
```

### 3. Chạy ứng dụng

```bash
ng serve
```

Truy cập: `http://localhost:4200`

## 📋 API Endpoints Required

Backend cần implement các endpoints sau:

### Authentication
- `POST /api/v1/user/login` - Đăng nhập

### User Management
- `GET /api/v1/user` - Lấy danh sách users
- `GET /api/v1/user/{userName}` - Lấy user theo username
- `POST /api/v1/user` - Tạo user mới
- `PUT /api/v1/user/{userName}` - Cập nhật user
- `DELETE /api/v1/user/{userName}` - Xóa user

Chi tiết API documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

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

## 🔧 Cấu trúc Project

```
src/
├── app/
│   ├── features/
│   │   ├── admin/
│   │   │   ├── admin.component.*      # Admin layout với sidebar
│   │   │   ├── admin.routes.ts        # Admin routing
│   │   │   └── users/                 # User management component
│   │   │       ├── users.component.*
│   │   ├── logincomponent/            # Login page
│   │   ├── header/                    # Header với user info
│   │   ├── pages/
│   │   │   └── homepage/              # Public homepage
│   │   └── services/
│   │       └── user.service.ts        # User API service
│   ├── models/
│   │   └── user.model.ts              # User interface & types
│   └── core/
│       ├── services/
│       │   └── auth.service.ts        # Authentication service
│       ├── interceptors/
│       │   └── auth.interceptor.ts    # JWT token interceptor
│       └── guard/
│           └── auth.guard.ts          # Route guard
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

## 🔐 Authentication Flow

1. User login với username/password
2. Backend trả về user data và JWT token (optional)
3. Token được lưu trong localStorage với key `authToken`
4. HTTP Interceptor tự động thêm token vào mọi request: `Authorization: Bearer {token}`
5. Route Guard kiểm tra authentication trước khi vào admin routes

## 🎨 Routes

- `/` - Redirect to homepage
- `/home` - Public homepage
- `/login` - Login page
- `/admin` - Admin layout (requires authentication)
  - `/admin` - Redirect to `/admin/users`
  - `/admin/users` - User management (CRUD)

## 🛠️ Backend Setup Required

### CORS Configuration

Backend phải enable CORS cho origin: `http://localhost:4200`

#### Spring Boot Example:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

Chi tiết: [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)

## 📝 Tính năng User Management

### CRUD Operations
- ✅ **Create**: Thêm user mới với form validation
- ✅ **Read**: Hiển thị danh sách users với pagination
- ✅ **Update**: Cập nhật thông tin user (username không thể sửa)
- ✅ **Delete**: Xóa user với confirmation dialog

### Search & Filter
- Tìm kiếm theo: userName, fullName, email, phoneNumber
- Real-time search

### Display Fields
- Username
- Họ tên (Full Name)
- Email
- Tuổi (Age)
- Ngày sinh (Date of Birth)
- Số điện thoại (Phone Number)

## 📝 Lưu ý quan trọng

- **Không có security ở frontend**: Backend tự do implement security theo ý muốn
- **In-memory data đã bị loại bỏ**: Project chỉ hoạt động với backend API
- **JWT optional**: Backend có thể trả về token hoặc không, frontend sẽ tự động xử lý
- **Backend URL mặc định**: `http://localhost:8080`
- **Chỉ quản lý User**: Không có Student hoặc model khác

## 🐛 Troubleshooting

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Giải pháp**: 
- Kiểm tra CORS config ở backend
- Đảm bảo allow origin `http://localhost:4200`
- Thêm allowedHeaders: "*" và allowCredentials: true

### 404 Not Found
```
GET http://localhost:8080/api/v1/user 404 Not Found
```
**Giải pháp**:
- Kiểm tra backend đang chạy
- Verify endpoint URLs khớp với backend
- Check `environment.apiUrl`

### Connection Refused
```
GET http://localhost:8080/api/v1/user net::ERR_CONNECTION_REFUSED
```
**Giải pháp**:
- Đảm bảo backend đang chạy trên port 8080
- Check firewall settings
- Thử truy cập backend URL trực tiếp từ browser

## 📚 Additional Resources

- [Angular CLI](https://angular.dev/tools/cli)
- [Angular Documentation](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [API Documentation](./API_DOCUMENTATION.md)
- [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md)

## 👨‍💻 Development Commands

### Chạy dev server
```bash
ng serve
```

### Build production
```bash
ng build --configuration production
```

### Run tests
```bash
ng test
```

### Generate component
```bash
ng generate component features/my-component --standalone
```

## 🎉 Các thay đổi so với version trước

### ✅ Đã loại bỏ
- ❌ Student management (homecomponent)
- ❌ Student service
- ❌ Student model
- ❌ Update-student modal
- ❌ Search modal
- ❌ In-memory data service

### ✅ Chỉ giữ lại
- ✅ User management
- ✅ User service với RESTful API
- ✅ Authentication
- ✅ Admin layout (sidebar đơn giản chỉ có Users)

## 📄 License

This project is for educational purposes.

