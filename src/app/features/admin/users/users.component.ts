import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { UserService } from '../../services/user.service';
import { UserResponse, CreateUserRequest, UpdateUserRequest } from '../../../models/user.model';
import {SearchModalComponent} from '../../../shared/modal/search-modal/search-modal.component';
import {SelectModalComponent, SelectOption} from '../../../shared/modal/select-modal/select-modal.component';
import {PaginationModalComponent} from '../../../shared/modal/pagination-modal/pagination-modal.component';
import { PageEvent } from '@angular/material/paginator';
import {CompanyprofileService} from '../../services/companyprofile.service';
import {LookupService} from '../../services/lookup.service';
import {DepartmentService} from '../../services/department.service';
import {FormCreateUserModalComponent} from '../../../shared/modal/form-create-user-modal/form-create-user-modal.component';
import {FormUpdateUserModalComponent} from '../../../shared/modal/form-update-user-modal/form-update-user-modal.component';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatDialogModule, SearchModalComponent, SelectModalComponent, PaginationModalComponent],
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
    'updatedBy'
  ];
  dataSource = new MatTableDataSource<UserResponse>([]);

  // Pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 15, 20, 25, 50];

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
    positionCd: [] as number[],
    companyId: [] as number[]
  };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private userService: UserService,
    private companyProfileService: CompanyprofileService,
    private departmentService: DepartmentService,
    private lookupService: LookupService,
    private dialog: MatDialog
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
    const params = {
      ...this.filters,
      page: this.pageIndex,
      limit: this.pageSize
    };

    this.userService.getUsersWithFilter(params).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.items || response.data || [];
        this.totalItems = response.total;
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
          value: d.id,
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
    this.pageIndex = 0; // Reset to first page when searching
    this.loadUsers();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onDepartmentChange(values: any) {
    // Handle multiple selection - send array to backend
    if (Array.isArray(values) && values.length > 0) {
      // If 'all' is selected, send empty array
      this.filters.departmentId = values.includes('all') ? [] : values;
    } else {
      this.filters.departmentId = [];
    }
    this.pageIndex = 0; // Reset to first page when filtering
    this.loadUsers();
  }

  onRoleChange(values: any) {
    // Handle multiple selection - send array to backend
    if (Array.isArray(values) && values.length > 0) {
      // If 'all' is selected, send empty array
      this.filters.positionCd = values.includes('all') ? [] : values;
    } else {
      this.filters.positionCd = [];
    }
    this.pageIndex = 0; // Reset to first page when filtering
    this.loadUsers();
  }

  onCompanyChange(values: any) {
    // Handle multiple selection - send array to backend
    if (Array.isArray(values) && values.length > 0) {
      // If 'all' is selected, send empty array
      this.filters.companyId = values.includes('all') ? [] : values;
    } else {
      this.filters.companyId = [];
    }
    this.pageIndex = 0; // Reset to first page when filtering
    this.loadUsers();
  }

  onStatusChange(values: any) {
    // Handle multiple selection - send array to backend
    if (Array.isArray(values) && values.length > 0) {
      // If 'all' is selected, send empty array
      this.filters.statusFlg = values.includes('all') ? [] : values;
    } else {
      this.filters.statusFlg = [];
    }
    this.pageIndex = 0; // Reset to first page when filtering
    this.loadUsers();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openCreateUserModal() {
    const dialogRef = this.dialog.open(FormCreateUserModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    // Pass company and department options to the modal
    dialogRef.componentInstance.companyOptions = this.companyOptions.filter(opt => opt.value !== 'all');
    dialogRef.componentInstance.departmentOptions = this.departmentOptions.filter(opt => opt.value !== 'all');

    dialogRef.componentInstance.onSubmit.subscribe((data: CreateUserRequest) => {
      this.handleCreateUser(data);
    });

    dialogRef.componentInstance.onCancel.subscribe(() => {
      dialogRef.close();
    });
  }

  handleCreateUser(data: CreateUserRequest) {
    console.log('Creating user:', data);
    this.userService.createUser(data).subscribe({
      next: (response: any) => {
        console.log('User created successfully:', response);
        this.dialog.closeAll();
        this.loadUsers(); // Reload users list
        // You can add a success notification here
      },
      error: (error: any) => {
        console.error('Error creating user:', error);
        // You can add an error notification here
      }
    });
  }

  openUpdateUserModal(user: UserResponse) {
    const dialogRef = this.dialog.open(FormUpdateUserModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    // Pass user data and options to modal
    dialogRef.componentInstance.userData = user;
    dialogRef.componentInstance.companyOptions = this.companyOptions.filter(opt => opt.value !== 'all');
    dialogRef.componentInstance.departmentOptions = this.departmentOptions.filter(opt => opt.value !== 'all');
    dialogRef.componentInstance.roleOptions = this.roleOptions.filter(opt => opt.value !== 'all');
    dialogRef.componentInstance.statusOptions = this.statusOptions.filter(opt => opt.value !== 'all');
    dialogRef.componentInstance.departmentOptions = this.departmentOptions.filter(opt => opt.value !== 'all');

    dialogRef.componentInstance.onSubmit.subscribe((data: UpdateUserRequest) => {
      this.handleUpdateUser(user.id, data);
    });

    dialogRef.componentInstance.onCancel.subscribe(() => {
      dialogRef.close();
    });
  }

  handleUpdateUser(id: string, data: UpdateUserRequest) {
    console.log('Updating user:', data);
    this.userService.updateUser(id, data).subscribe({
      next: (response: any) => {
        console.log('User updated successfully:', response);
        this.dialog.closeAll();
        this.loadUsers(); // Reload users list
        // You can add a success notification here
      },
      error: (error: any) => {
        console.error('Error updating user:', error);
        // You can add an error notification here
      }
    });
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
