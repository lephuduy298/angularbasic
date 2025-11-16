import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserResponse} from '../../models/user.model';
import {catchError, Observable, of, tap} from 'rxjs';
import {CompanyProfile} from '../../models/companyprofile.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyprofileService {

  private apiUrl = `${environment.apiUrl}/api/v1/company_profiles`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllCompanyProfiles() {
    return this.http.get<CompanyProfile[]>(this.apiUrl)
      .pipe(
        tap(_ => console.log('Đã lấy danh sách users')),
        catchError(this.handleError<CompanyProfile[]>('getUsers', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} thất bại: ${error.message}`);
      return of(result as T);
    };
  }

}


