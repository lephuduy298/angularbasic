import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {
  private apiUrl = `${environment.apiUrl}/user-service/api/v1/users`;

  constructor(private http: HttpClient) {}

  getUserHistory(userId: string, page: number = 0, limit: number = 12): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/${userId}/history`, { params });
  }
}

