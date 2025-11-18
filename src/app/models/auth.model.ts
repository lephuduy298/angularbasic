export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    refreshToken?: string;
    user?: {
      id: string;
      username: string;
      email: string;
      fullName: string;
      roles?: string[];
    };
  };
}

