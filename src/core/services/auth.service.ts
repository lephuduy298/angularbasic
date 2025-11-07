import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, of, tap} from 'rxjs';
import {User, LoginRequest, LoginResponse} from '../../app/models/user.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/v1`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject(this.getUserFromStorage());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  private getUserFromStorage(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  private setCurrentUser(user: User | null) {
    if(user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(user);
  }

  // Login with backend API
  login(loginData: LoginRequest): Observable<LoginResponse> {
    const url = `${this.apiUrl}/user/login`;
    return this.http.post<LoginResponse>(url, loginData, this.httpOptions)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setCurrentUser(response.data);
            if (response.token) {
              localStorage.setItem('authToken', response.token);
            }
            console.log('Đăng nhập thành công');
          }
        }),
        catchError(error => {
          console.error('Đăng nhập thất bại:', error);
          return of({success: false, message: 'Đăng nhập thất bại'} as LoginResponse);
        })
      );
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} thất bại: ${error.message}`);
      return of(result as T);
    };
  }
}
