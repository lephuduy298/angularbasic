import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private apiUrl = `${environment.apiUrl}/api/v1/lookups`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllStatus(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getByLookupType(lookupType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${lookupType}`);
  }

}
