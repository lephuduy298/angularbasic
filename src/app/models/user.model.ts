export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  age: number;
  dateOfBirth: string; // ISO date string (YYYY-MM-DD)
  phoneNumber: string;
  role?: string; // Optional role field for admin/user distinction
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: User;
  message?: string;
  token?: string; // Optional JWT token
}

