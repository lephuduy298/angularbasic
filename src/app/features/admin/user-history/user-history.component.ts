import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UserHistoryService } from '../../services/user-history.service';
import { UserHistory } from '../../../models/user-history.model';
import { PaginationModalComponent } from '../../../shared/modal/pagination-modal/pagination-modal.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    PaginationModalComponent
  ],
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {
  userId: string = '';
  userName: string = '';
  historyData: UserHistory[] = [];
  displayedColumns: string[] = ['stt', 'fieldName', 'oldValue', 'newValue', 'changedBy', 'changedDate'];

  // Pagination
  totalItems: number = 0;
  pageSize: number = 12;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [12, 24, 36, 48];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userHistoryService: UserHistoryService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];

    // Read userName from router state instead of query params
    const state =  window.history.state;
    this.userName = state?.userName || 'Unknown User';

    console.log('User ID:', this.userId);
    console.log('User Name from state:', this.userName);

    this.loadUserHistory();
  }

  loadUserHistory() {
    console.log('Loading history for userId:', this.userId, 'page:', this.pageIndex, 'size:', this.pageSize);
    this.userHistoryService.getUserHistory(this.userId, this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {

        const data = response.data || response;

        this.historyData = data.items || [];

        if (data.pagination) {
          this.totalItems = data.pagination.totalItems;
          console.log('Total items:', this.totalItems);
        }
      },
      error: (error: any) => {
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUserHistory();
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }

  getFieldNameLabel(fieldName: string): string {
    const fieldLabels: { [key: string]: string } = {
      'userName': 'Tên đăng nhập',
      'email': 'Email',
      'fullName': 'Họ và tên',
      'birthDate': 'Ngày sinh',
      'genderCd': 'Giới tính',
      'address': 'Địa chỉ',
      'phoneNo': 'Số điện thoại',
      'faxNo': 'Số fax',
      'identity': 'Số CMND/CCCD',
      'identityTypeCd': 'Loại giấy tờ',
      'identityIssuedDate': 'Ngày cấp',
      'identityIssuedPlace': 'Nơi cấp',
      'departmentId': 'Đơn vị',
      'positionCd': 'Chức vụ',
      'statusFlg': 'Trạng thái',
      'companyProfileId': 'Công ty',
      'description': 'Mô tả'
    };
    return fieldLabels[fieldName] || fieldName;
  }
}

