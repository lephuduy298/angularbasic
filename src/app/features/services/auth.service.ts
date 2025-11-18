import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user-service/api/v1`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    // Khởi tạo currentUser từ localStorage nếu có
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Lấy thông tin user hiện tại
   */
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  /**
   * Đăng nhập với username và password
   * @param loginRequest - Object chứa username và password
   * @returns Observable<LoginResponse>
   */
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      loginRequest,
      { headers, withCredentials: true } // Quan trọng: gửi và nhận cookies
    ).pipe(
      tap(response => {
        console.log('Login response:', response);

        if (response.success && response.data?.user) {
          // Chỉ lưu thông tin user, không lưu token vì đã có trong cookie
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
          console.log('User info saved:', response.data.user);
        }
      })
    );
  }

  /**
   * Đăng xuất - xóa thông tin user
   */
  logout(): void {
    // Chỉ xóa thông tin user, cookie sẽ tự động expire hoặc xóa bởi backend
    localStorage.removeItem('currentUser');

    // Reset currentUser subject
    this.currentUserSubject.next(null);

    console.log('User logged out, user info removed');
  }

  /**
   * Kiểm tra xem user đã đăng nhập chưa
   * @returns true nếu có user info trong localStorage
   */
  isLoggedIn(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    return !!currentUser;
  }

  /**
   * Lấy token từ cookie (không cần thiết vì cookie tự động gửi)
   * @returns null vì token nằm trong httpOnly cookie
   */
  getToken(): string | null {
    return null; // Token nằm trong httpOnly cookie, không thể truy cập từ JavaScript
  }

  /**
   * Lấy refresh token từ localStorage
   * @returns refresh token string hoặc null
   */
  getRefreshToken(): string | null {
    return null; // Không sử dụng refresh token nữa
  }

  /**
   * Lấy thông tin user từ localStorage
   * @returns User object hoặc null
   */
  getCurrentUser(): any {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}

