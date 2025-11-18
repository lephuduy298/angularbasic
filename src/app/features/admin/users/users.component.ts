import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
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
import {NoDataModalComponent} from '../../../shared/modal/no-data-modal/no-data-modal.component';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatDialogModule, MatCheckboxModule, SearchModalComponent, SelectModalComponent, PaginationModalComponent, NoDataModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
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
  selection = new SelectionModel<UserResponse>(true, []);

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
  genderOptions: SelectOption[] = [];
  identityTypeOptions: SelectOption[] = [];

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
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCompanyProfile();
    this.loadDepartment();
    this.loadLookupPosition();
    this.loadLookupStatus();
    this.loadLookupGender();
    this.loadLookupIdentityType();
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

  loadLookupGender() {
    this.lookupService.getByLookupType('GENDER').subscribe({
      next: (genders: any) => {
        // Map genders to SelectOption format { value, label }
        this.genderOptions = genders.data.map((g: any) => ({
          value: g.lookupCd,
          label: g.lookupValue ?? 'Unknown'
        }));

        console.log('Genders loaded:', this.genderOptions);
      },
      error: (error: any) => {
        console.error('Error loading genders:', error);
      }
    })
  }

  loadLookupIdentityType() {
    this.lookupService.getByLookupType('IDENTITY_TYPE').subscribe({
      next: (identityTypes: any) => {
        // Map identity types to SelectOption format { value, label }
        this.identityTypeOptions = identityTypes.data.map((i: any) => ({
          value: i.lookupCd,
          label: i.lookupValue ?? 'Unknown'
        }));

        console.log('Identity types loaded:', this.identityTypeOptions);
      },
      error: (error: any) => {
        console.error('Error loading identity types:', error);
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
      width: '1200px',
      maxWidth: '95vw',
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
      width: '1200px',
      maxWidth: '95vw',
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
    dialogRef.componentInstance.genderOptions = this.genderOptions;
    dialogRef.componentInstance.identityTypeOptions = this.identityTypeOptions;

    dialogRef.componentInstance.onSubmit.subscribe((data: UpdateUserRequest) => {
      this.handleUpdateUser(user.id, data);
    });

    dialogRef.componentInstance.onCancel.subscribe(() => {
      dialogRef.close();
    });

    // Listen to status change event to reload users
    dialogRef.componentInstance.onStatusChanged.subscribe(() => {
      this.loadUsers(); // Reload users list when status is changed
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

  viewUserHistory(user: UserResponse) {
    this.router.navigate(['/admin/users', user.id, 'history'], {
      state: { userName: user.userName}
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserResponse): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.userName}`;
  }

  /** Get selected user IDs */
  getSelectedUserIds(): string[] {
    return this.selection.selected.map(user => user.id);
  }

  /** Check if any users are selected */
  hasSelectedUsers(): boolean {
    return this.selection.selected.length > 0;
  }

  /** Activate multiple users */
  activateSelectedUsers() {
    const selectedIds = this.getSelectedUserIds();
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một người dùng!');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn kích hoạt ${selectedIds.length} người dùng đã chọn?`)) {
      return;
    }

    this.userService.activateMultipleUsers(selectedIds).subscribe({
      next: (response: any) => {
        console.log('Users activated successfully:', response);
        const activatedCount = response.data?.activatedCount || response.activatedCount || selectedIds.length;
        const failed = response.data?.failed || response.failed || [];

        if (failed.length > 0) {
          alert(`Đã kích hoạt ${activatedCount} người dùng thành công. ${failed.length} người dùng thất bại.`);
        } else {
          alert(`Đã kích hoạt ${activatedCount} người dùng thành công!`);
        }

        this.selection.clear();
        this.loadUsers();
      },
      error: (error: any) => {
        console.error('Error activating users:', error);
        alert('Có lỗi xảy ra khi kích hoạt người dùng!');
      }
    });
  }

  /** Deactivate multiple users */
  deactivateSelectedUsers() {
    const selectedIds = this.getSelectedUserIds();
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một người dùng!');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn vô hiệu hóa ${selectedIds.length} người dùng đã chọn?`)) {
      return;
    }

    this.userService.deactivateMultipleUsers(selectedIds).subscribe({
      next: (response: any) => {
        console.log('Users deactivated successfully:', response);
        const deactivatedCount = response.data?.deactivatedCount || response.deactivatedCount || selectedIds.length;
        const failed = response.data?.failed || response.failed || [];

        if (failed.length > 0) {
          alert(`Đã vô hiệu hóa ${deactivatedCount} người dùng thành công. ${failed.length} người dùng thất bại.`);
        } else {
          alert(`Đã vô hiệu hóa ${deactivatedCount} người dùng thành công!`);
        }

        this.selection.clear();
        this.loadUsers();
      },
      error: (error: any) => {
        console.error('Error deactivating users:', error);
        alert('Có lỗi xảy ra khi vô hiệu hóa người dùng!');
      }
    });
  }
}
