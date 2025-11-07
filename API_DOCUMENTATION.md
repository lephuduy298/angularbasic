# Hướng dẫn tích hợp Backend RESTful API

Dự án frontend đã được chuyển đổi hoàn toàn sang mô hình RESTful API. Dưới đây là các endpoint mà backend cần implement:

## API Endpoints

### User API (`/api/v1/user`)

#### 1. Login (Authentication)
```
POST /api/v1/user/login
Content-Type: application/json

Request Body:
{
  "userName": "string",
  "password": "string"
}

Response (Success):
{
  "success": true,
  "data": {
    "userName": "string",
    "fullName": "string",
    "email": "string",
    "age": number,
    "dateOfBirth": "YYYY-MM-DD",
    "phoneNumber": "string",
    "role": "admin" | "user"
  },
  "token": "JWT_TOKEN_HERE" // Optional
}

Response (Failure):
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 2. Get User by Username
```
GET /api/v1/user/{userName}
Authorization: Bearer {token}

Response:
{
  "userName": "string",
  "fullName": "string",
  "email": "string",
  "age": number,
  "dateOfBirth": "YYYY-MM-DD",
  "phoneNumber": "string",
  "role": "admin" | "user"
}
```

#### 3. Create User (Register)
```
POST /api/v1/user
Content-Type: application/json

Request Body:
{
  "userName": "string",
  "fullName": "string",
  "email": "string",
  "age": number,
  "dateOfBirth": "YYYY-MM-DD",
  "phoneNumber": "string",
  "password": "string"
}

Response:
{
  "userName": "string",
  "fullName": "string",
  "email": "string",
  "age": number,
  "dateOfBirth": "YYYY-MM-DD",
  "phoneNumber": "string"
}
```

#### 4. Update User
```
PUT /api/v1/user/{userName}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "userName": "string",
  "fullName": "string",
  "email": "string",
  "age": number,
  "dateOfBirth": "YYYY-MM-DD",
  "phoneNumber": "string"
}

Response: Same as request body
```

#### 5. Delete User
```
DELETE /api/v1/user/{userName}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### 6. Get All Users (Admin only)
```
GET /api/v1/user
Authorization: Bearer {token}

Response:
[
  {
    "userName": "string",
    "fullName": "string",
    "email": "string",
    "age": number,
    "dateOfBirth": "YYYY-MM-DD",
    "phoneNumber": "string",
    "role": "admin" | "user"
  }
]
```



## CORS Configuration

Backend cần enable CORS với config sau:

```javascript
// Node.js/Express example
app.use(cors({
  origin: 'http://localhost:4200', // Angular dev server
  credentials: true
}));
```

## JWT Authentication

- Token được gửi trong header: `Authorization: Bearer {token}`
- Frontend tự động thêm token vào mọi request thông qua HTTP Interceptor
- Token được lưu trong `localStorage` với key `authToken`

## Environment Configuration

Thay đổi API URL trong file:
`src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000' // Đổi thành URL backend của bạn
};
```

## Sample Data

### User Example
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



