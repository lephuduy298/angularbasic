import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { UserService } from '../../services/user.service';
import { User } from '../../../models/user.model';
import {SearchModalComponent} from '../../../shared/modal/search-modal/search-modal.component';
import {SelectModalComponent, SelectOption} from '../../../shared/modal/select-modal/select-modal.component';
import {CompanyprofileService} from '../../services/companyprofile.service';
import {LookupService} from '../../services/lookup.service';
import {DepartmentService} from '../../services/department.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, SearchModalComponent, SelectModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'stt',
    'userName',
    'departmentName',
    'roleName',
    'fullName',
    'birthDate',
    'email',
    'companyName',
    'detail',
    'statusFlag',
    'createdDate',
    'createdBy',
    'updatedDate',
    'updatedBy',
  ];
  dataSource = new MatTableDataSource<User>([]);

  // Filter options
  departmentOptions: SelectOption[] = [];
  roleOptions: SelectOption[] = [];
  companyOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  // Current filter values
  filters = {
    keyword: '',
    departmentId: [] as number[],
    statusFlg: [] as number[],
    positionCd:[] as number[],
    companyId:[] as number[],
    page: 0,
    limit: 12
  };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private userService: UserService,
    private companyProfileService: CompanyprofileService,
    private departmentService: DepartmentService,
    private lookupService: LookupService,

  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCompanyProfile();
    this.loadDepartment();
    this.loadLookupPosition();
    this.loadLookupStatus();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.userService.getUsersWithFilter(this.filters).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.items || response.data || [];
        console.log('Đã tải danh sách users:', response);
      },
      error: (error) => {
        console.error('Lỗi khi tải users:', error);
      }
    });
  }

  loadCompanyProfile() {
    this.companyProfileService.getAllCompanyProfiles().subscribe({
      next: (companies: any) => {
        // Map companies to SelectOption format { value, label }
        this.companyOptions =companies.data.map((c: any) => ({
          value: c.id,
          label: c.companyName ?? 'Unknown'
        }));

        // Add "All" option at the beginning
        this.companyOptions.unshift({ value: 'all', label: 'Tất cả công ty' });

        console.log('Companies loaded:', this.companyOptions);
      },
      error: (error: any) => {
        console.error('Error loading companies:', error);
      }
    })
  }

  loadDepartment() {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments: any) => {
        // Map departments to SelectOption format { value, label }
        this.departmentOptions = (departments.data || []).map((d: any) => ({
          value: d.id ?? d.departmentId,
          label: d.departmentName ?? 'Unknown'
        }));

        // Add "All" option at the beginning
        this.departmentOptions.unshift({ value: 'all', label: 'Tất cả đơn vị' });

        console.log('Departments loaded:', this.departmentOptions);
      },
      error: (error: any) => {
        console.error('Error loading departments:', error);
      }
    })
  }

  loadLookupPosition() {
    this.lookupService.getByLookupType('POSITION').subscribe({
      next: (positions: any) => {
        // Map positions to SelectOption format { value, label }
        console.log(">>>>>>: {}", positions);
        console.log(">>>>>>: {}", positions.data);
        this.roleOptions = positions.data.map((p: any) => ({
          value: p.lookupCd,
          label: p.lookupValue ?? 'Unknown'
        }));

        // Add "All" option at the beginning
        this.roleOptions.unshift({ value: 'all', label: 'Tất cả vai trò' });

        console.log('Positions loaded:', this.roleOptions);
      },
      error: (error: any) => {
        console.error('Error loading positions:', error);
      }
    })
  }

  loadLookupStatus() {
    this.lookupService.getByLookupType('STATUS').subscribe({
      next: (statuses: any) => {
        // Map statuses to SelectOption format { value, label }
        this.statusOptions = statuses.data.map((s: any) => ({
          value: s.lookupCd,
          label: s.lookupValue ?? 'Unknown'
        }));

        // Add "All" option at the beginning
        this.statusOptions.unshift({ value: 'all', label: 'Tất cả trạng thái' });

        console.log('Statuses loaded:', this.statusOptions);
      },
      error: (error: any) => {
        console.error('Error loading statuses:', error);
      }
    })
  }

  onSearch(searchTerm: string) {
    this.filters.keyword = searchTerm;
    this.filters.page = 0; // Reset to first page when searching
    this.loadUsers();
  }

  onDepartmentChange(values: any) {
    // Handle multiple selection - send array to backend
    if (Array.isArray(values) && values.length > 0) {
      // If 'all' is selected, send empty array
    this.filters.page = 1;
    } else {
      this.filters.departmentId = [];
    }
    this.filters.page = 0;
    this.loadUsers();
  }

  onRoleChange(values: any) {
    // Handle multiple selection - send array to backend
    if (Array.isArray(values) && values.length > 0) {
      // If 'all' is selected, send empty array
    this.filters.page = 1;
    } else {
      this.filters.positionCd = [];
    }
    this.filters.page = 0;
    this.loadUsers();
  }

  onCompanyChange(values: any) {
    // Handle multiple selection - send array to backend
    if (Array.isArray(values) && values.length > 0) {
      // If 'all' is selected, send empty array
    this.filters.page = 1;
    } else {
      this.filters.companyId = [];
    }
    this.filters.page = 0;
    this.loadUsers();
  }

  onStatusChange(values: any) {
    // Handle multiple selection - send array to backend
    if (Array.isArray(values) && values.length > 0) {
      // If 'all' is selected, send empty array
      this.filters.statusFlg = values.includes('all') ? [] : values;
    } else {
      this.filters.page = 1;
      this.loadUsers();
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
