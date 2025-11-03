import {Injectable, signal} from '@angular/core';
import {LoginUser, UserResponse} from '../../app/features/logincomponent/logincomponent.component';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {Student} from '../../app/features/services/student.service';

export interface UserAccount {
  username: string
  password: string
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'api/users';

  constructor(private http: HttpClient) {
  }

  getUserFromStorage(): UserResponse | null {
    const stored = localStorage.getItem('userG');
    return stored ? JSON.parse(stored) : null;
  }

  private setCurrentUser(userResponse: UserResponse | null) {
    if(userResponse) {
      localStorage.setItem('userG', JSON.stringify(userResponse));
    } else {
      localStorage.removeItem('userG');
    }
  }

  login(loginData: LoginUser): Observable<any> {
    return this.http.get<UserAccount[]>(this.loginUrl)
      .pipe(
        map(users => {
          const user = users.find(u => u.username === loginData.username && u.password === loginData.password);
          if (user) {
            const userResponse = {username: user.username, role: user.role} as UserResponse;
            this.setCurrentUser(userResponse);  // ← Cập nhật user sau khi login thành công
            return {success: true, data: userResponse};          } else {
            return {success: false};
          }
        }),
        tap(_ => console.log('Đăng nhập12345')),
        catchError(this.handleError<LoginUser>('Login'))
      );
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} th¿t b¿i: ${error.message}`);
      return of(result as T);
    };
  }
}
