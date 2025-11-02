import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
export interface Student {
  id: number;
  name: string;
  grades: number;
}
@Injectable({ providedIn: 'root' })
export class StudentService {
  private studentsUrl = 'api/students';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }
  // L¿y t¿t c¿ sinh viên
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsUrl)
      .pipe(
        tap(_ => console.log(' ã l¿y danh sách sinh viên')),
        catchError(this.handleError<Student[]>('getStudents', []))
      );
  }
  // L¿y sinh viên theo ID
  getStudent(id: number): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
    return this.http.get<Student>(url)
      .pipe(
        tap(_ => console.log(` ã l¿y sinh viên id=${id}`)),
        catchError(this.handleError<Student>(`getStudent id=${id}`))
      );
  }
  // Thêm sinh viên mßi
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentsUrl, student, this.httpOptions)
      .pipe(
        tap((newStudent: Student) => console.log(` ã thêm sinh viên id=${newStudent.id}`)),
        catchError(this.handleError<Student>('addStudent'))
      );
  }
  // C¿p nh¿t sinh viên
  updateStudent(student: Student): Observable<any> {
    return this.http.put(this.studentsUrl, student, this.httpOptions)
      .pipe(
        tap(_ => console.log(` ã c¿p nh¿t sinh viên id=${student.id}`)),
        catchError(this.handleError<any>('updateStudent'))
      );
  }
  // Xóa sinh viên
  deleteStudent(id: number): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
    return this.http.delete<Student>(url, this.httpOptions)
      .pipe(
        tap(_ => console.log(` ã xóa sinh viên id=${id}`)),
        catchError(this.handleError<Student>('deleteStudent'))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} th¿t b¿i: ${error.message}`);
      return of(result as T);
    };
  }
}
