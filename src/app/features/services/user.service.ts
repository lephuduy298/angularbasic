import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/v1/users`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Lấy tất cả users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(
        tap(_ => console.log('Đã lấy danh sách users')),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  // Lấy user theo username
  getUserByUsername(username: string): Observable<User> {
    const url = `${this.apiUrl}/${username}`;
    return this.http.get<User>(url)
      .pipe(
        tap(_ => console.log(`Đã lấy user username=${username}`)),
        catchError(this.handleError<User>(`getUserByUsername username=${username}`))
      );
  }

  // Thêm user mới
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, this.httpOptions)
      .pipe(
        tap((newUser: User) => console.log(`Đã thêm user username=${newUser.userName}`)),
        catchError(this.handleError<User>('addUser'))
      );
  }

  // Cập nhật user
  updateUser(username: string, user: User): Observable<User> {
    const url = `${this.apiUrl}/${user.id}`;
    return this.http.put<User>(url, user, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Đã cập nhật user username=${username}`)),
        catchError(this.handleError<User>('updateUser'))
      );
  }

  // Xóa user
  deleteUser(username: string): Observable<any> {
    const url = `${this.apiUrl}/${username}`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Đã xóa user username=${username}`)),
        catchError(this.handleError<any>('deleteUser'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} thất bại: ${error.message}`);
      return of(result as T);
    };
  }
}

