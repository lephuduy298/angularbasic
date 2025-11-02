import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo} from 'angular-in-memory-web-api';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class InMemoryDataService implements InMemoryDbService {
  createDb(reqInfo?: RequestInfo): {} | Observable<{}> | Promise<{}> {
      const students = [
        { id: 1, name: 'Nguyen Vn An', grades: 8.5 },
        { id: 2, name: 'Tran Thi Binh', grades: 9.0 },
        { id: 3, name: 'Lê Hoàng Cung', grades: 7.8 },
        { id: 4, name: 'Phạm Minh D', grades: 9.2 },
        { id: 5, name: 'Võ Thanh E', grades: 6.8 },
        { id: 6, name: 'Đỗ Thiên F', grades: 5.5 },
        { id: 7, name: 'Ngô Ngọc G', grades: 8.0 },
        { id: 8, name: 'Đinh Đức H', grades: 9.9 },
        { id: 9, name: 'Bùi Thị I', grades: 4.7 },
        { id: 10, name: 'Huỳnh Văn K', grades: 6.3 },
        { id: 11, name: 'Lý Minh L', grades: 7.4 },
        { id: 12, name: 'Tạ Văn M', grades: 8.1 },
        { id: 13, name: 'Đặng Quốc N', grades: 5.9 },
        { id: 14, name: 'Hồ Nhật O', grades: 6.7 },
        { id: 15, name: 'Trương Thảo P', grades: 9.0 }
      ];

    const users = [
      { id: 1, username: 'admin', password: '123456', role: 'admin' },
      { id: 2, username: 'user', password: '123456', role: 'user' }
    ];
      return { students, users };
    }
}
