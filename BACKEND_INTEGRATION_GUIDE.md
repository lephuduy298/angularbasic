# Backend Integration Guide

## Tổng quan

Frontend chỉ quản lý **User** - không có Student management.

## Cấu hình Backend URL

Mặc định: `http://localhost:8080`

Để thay đổi, sửa file: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080' // Thay đổi URL này
};
```

## API Endpoints Required

### User Management API

**Base URL:** `/api/v1/user`

#### Login
```
POST /api/v1/user/login
Body: { userName, password }
Response: { success, data: User, token?, message? }
```

#### Get All Users
```
GET /api/v1/user
Response: User[]
```

#### Get User by Username
```
GET /api/v1/user/{userName}
Response: User
```

#### Create User
```
POST /api/v1/user
Body: User
Response: User
```

#### Update User
```
PUT /api/v1/user/{userName}
Body: User
Response: User
```

#### Delete User
```
DELETE /api/v1/user/{userName}
Response: { success, message }
```

## Data Model

### User Model
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

## CORS Configuration

Backend cần enable CORS cho origin: `http://localhost:4200`

### Spring Boot Example:
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

### Node.js/Express Example:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

## Security Notes

- Frontend không xử lý security/authentication ở frontend
- Backend tự do implement security mechanism của riêng mình
- Nếu sử dụng JWT, frontend sẽ tự động lưu token trong localStorage với key `authToken`
- Frontend sẽ gửi token trong header: `Authorization: Bearer {token}` (nếu có)

## Testing Backend

1. Đảm bảo backend đang chạy tại URL đã config
2. Test các endpoint với Postman hoặc curl
3. Chạy Angular app: `ng serve`
4. Truy cập: `http://localhost:4200`

## Troubleshooting

### CORS Error
- Kiểm tra CORS config ở backend
- Đảm bảo backend allow origin `http://localhost:4200`

### 404 Not Found
- Kiểm tra endpoint URLs
- Đảm bảo backend đang chạy
- Kiểm tra `environment.apiUrl` trong Angular

### Connection Refused
- Đảm bảo backend đang chạy
- Kiểm tra port number trong URL
- Check firewall settings

## Sample Backend Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

