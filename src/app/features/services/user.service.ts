import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { UserResponse, CreateUserRequest } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user-service/api/v1/users`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Lấy tất cả users
  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl)
      .pipe(
        tap(_ => console.log('Đã lấy danh sách users')),
        catchError(this.handleError<UserResponse[]>('getUsers', []))
      );
  }

  // Lấy users với filter từ backend
  getUsersWithFilter(params: {
    keyword?: string;
    departmentId?: number[];
    positionCd?: number[];
    companyId?: number[];
    statusFlg?: number[];
    page?: number;
    limit?: number;
  }): Observable<any> {

    const httpParams = new HttpParams({ fromObject: {
        keyword: params.keyword || '',
        departmentId: params.departmentId?.join(',') || '',
        positionCd: params.positionCd?.join(',') || '',
        companyId: params.companyId?.join(',') || '',
        statusFlg: params.statusFlg?.join(',') || '',
        page: (params.page ?? 1).toString(),
        limit: (params.limit ?? 12).toString(),
      }});



    const url = `${this.apiUrl}`;
    console.log('Request URL:', url + '?' + httpParams.toString());

    return this.http.get<any>(url, { params: httpParams })
      .pipe(
        tap(_ => console.log('Đã lấy danh sách users với filter')),
        catchError(this.handleError<any>('getUsersWithFilter', { items: [], total: 0 }))
      );
  }

  // Tạo user mới với CreateUserRequest
  createUser(user: CreateUserRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, user, this.httpOptions)
      .pipe(
        tap((newUser: any) => console.log(`Đã tạo user mới:`, newUser)),
        catchError(this.handleError<any>('createUser'))
      );
  }


  // Lấy user theo username
  getUserByUsername(username: string): Observable<UserResponse> {
    const url = `${this.apiUrl}/${username}`;
    return this.http.get<UserResponse>(url)
      .pipe(
        tap(_ => console.log(`Đã lấy user username=${username}`)),
        catchError(this.handleError<UserResponse>(`getUserByUsername username=${username}`))
      );
  }

  // Thêm user mới
  addUser(user: UserResponse): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user, this.httpOptions)
      .pipe(
        tap((newUser: UserResponse) => console.log(`Đã thêm user username=${newUser}`)),
        catchError(this.handleError<UserResponse>('addUser'))
      );
  }

  // Cập nhật user
  updateUser(id: string, user: any): Observable<any> {
    console.log('Updating user:', id);
    console.log('User updated successfully:', user);
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, user, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Đã cập nhật user id=${id}`)),
        catchError(this.handleError<any>('updateUser'))
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

