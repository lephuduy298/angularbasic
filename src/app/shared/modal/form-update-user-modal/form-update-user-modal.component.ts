import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateUserRequest, UserResponse } from '../../../models/user.model';
import { SelectModalComponent, SelectOption } from '../select-modal/select-modal.component';
import { UserService } from '../../../features/services/user.service';

@Component({
  selector: 'app-form-update-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModalComponent],
  templateUrl: './form-update-user-modal.component.html',
  styleUrl: './form-update-user-modal.component.scss'
})
export class FormUpdateUserModalComponent implements OnInit {
  @Input() userData!: UserResponse;
  @Input() companyOptions: SelectOption[] = [];
  @Input() departmentOptions: SelectOption[] = [];
  @Input() roleOptions: SelectOption[] = [];
  @Input() statusOptions: SelectOption[] = [];
  @Input() identityTypeOptions: SelectOption[] = [];
  @Input() genderOptions: SelectOption[] = [];

  @Output() onSubmit = new EventEmitter<UpdateUserRequest>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onStatusChanged = new EventEmitter<void>();

  userForm!: FormGroup;
  isActivating = false;
  isDeactivating = false;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      userName: ['', [
        Validators.required,
        Validators.maxLength(18)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [Validators.maxLength(18)]], // Optional for update
      fullName: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      departmentId: [null, [Validators.required]],
      companyProfileId: [null, [Validators.required]],
      description: ['', [Validators.maxLength(255)]],

      // Additional fields
      birthDate: [null],
      genderCd: [null, [Validators.min(0), Validators.max(3)]],
      address: ['', [Validators.maxLength(255)]],
      phoneNo: ['', [Validators.pattern(/^[0-9]{10,11}$/)]],
      faxNo: [''],
      identity: ['', [Validators.pattern(/^[0-9]{9,12}$/)]],
      identityTypeCd: [null],
      identityIssuedDate: [null],
      identityIssuedPlace: ['', [Validators.maxLength(20)]],
      positionCd: [null],
      statusFlg: [null]
    });

    // Pre-fill form with user data
    if (this.userData) {
      console.log("User data status flag: {}", this.userData.statusFlg);
      this.userForm.patchValue({
        userName: this.userData.userName,
        email: this.userData.email,
        fullName: this.userData.fullName,
        departmentId: this.userData.departmentId,
        companyProfileId: this.userData.companyProfileId,
        description: this.userData.description || '',
        birthDate: this.userData.birthDate,
        genderCd: this.userData.genderCd,
        address: this.userData.address,
        phoneNo: this.userData.phoneNo,
        faxNo: this.userData.faxNo,
        identity: this.userData.identity,
        identityTypeCd: this.userData.identityTypeCd,
        identityIssuedDate: this.userData.identityIssuedDate,
        identityIssuedPlace: this.userData.identityIssuedPlace,
        positionCd: this.userData.positionCd,
        statusFlg: this.userData.statusFlg
      });
    }
  }

  handleSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      // Ensure departmentId and companyProfileId are numbers
      const payload: UpdateUserRequest= {
        userName: formValue.userName,
        email: formValue.email,
        fullName: formValue.fullName,
        departmentId: Number(formValue.departmentId),
        companyProfileId: Number(formValue.companyProfileId),
        description: formValue.description || '',
        birthDate: formValue.birthDate,
        genderCd: formValue.genderCd,
        address: formValue.address,
        phoneNo: formValue.phoneNo,
        faxNo: formValue.faxNo,
        identity: formValue.identity,
        identityTypeCd: formValue.identityTypeCd,
        identityIssuedDate: formValue.identityIssuedDate,
        identityIssuedPlace: formValue.identityIssuedPlace,
        positionCd: formValue.positionCd,
        statusFlg: formValue.statusFlg
      };

      // Only include password if it was entered
      if (formValue.password && formValue.password.trim()) {
        payload.password = formValue.password;
      }

      console.log('Submitting update user data:', payload);
      this.onSubmit.emit(payload);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid:', this.userForm.errors);
      console.log('Form values:', this.userForm.value);
    }
  }

  handleCancel() {
    this.onCancel.emit();
  }

  // Helper methods to get error messages
  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.hasError('required')) {
      switch (fieldName) {
        case 'userName': return 'Tên tài khoản không được để trống';
        case 'email': return 'Email không được để trống';
        case 'password': return 'Mật khẩu không được để trống';
        case 'fullName': return 'Họ và tên không được để trống';
        case 'departmentId': return 'Không được để trống';
        case 'companyProfileId': return 'Không được để trống';
        default: return 'Trường này không được để trống';
      }
    }
    if (control?.hasError('maxlength')) {
      switch (fieldName) {
        case 'userName': return 'Tên tài khoản không được quá 18 ký tự';
        case 'password': return 'Mật khẩu không được quá 18 ký tự';
        case 'fullName': return 'Họ và tên không được quá 50 ký tự';
        case 'description': return 'Độ dài không quá 255 ký tự';
        case 'address': return 'Địa chỉ không được quá 255 ký tự';
        case 'identityIssuedPlace': return 'Nơi cấp không được quá 20 ký tự';
        default: return 'Vượt quá độ dài cho phép';
      }
    }
    if (control?.hasError('email')) {
      return 'Email không đúng định dạng';
    }
    if (control?.hasError('pattern')) {
      switch (fieldName) {
        case 'phoneNo': return 'Số điện thoại không đúng định dạng';
        case 'identity': return 'Số CCCD không đúng định dạng';
        default: return 'Định dạng không hợp lệ';
      }
    }
    if (control?.hasError('min') || control?.hasError('max')) {
      switch (fieldName) {
        case 'genderCd': return 'Giới tính không hợp lệ';
        default: return 'Giá trị không hợp lệ';
      }
    }
    return '';
  }

  // Helper to check if field has error
  hasError(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Handle company selection change
  onCompanyChange(value: any) {
    this.userForm.patchValue({ companyProfileId: value });
    this.userForm.get('companyProfileId')?.markAsTouched();
  }

  // Handle department selection change
  onDepartmentChange(value: any) {
    this.userForm.patchValue({ departmentId: value });
    this.userForm.get('departmentId')?.markAsTouched();
  }

  // Handle role selection change
  onRoleChange(value: any) {
    this.userForm.patchValue({ positionCd: value });
    this.userForm.get('positionCd')?.markAsTouched();
  }

  // Handle status selection change
  onStatusChange(value: any) {
    this.userForm.patchValue({ statusFlg: value });
    this.userForm.get('statusFlg')?.markAsTouched();
  }

  // Handle identity type selection change
  onIdentityTypeChange(value: any) {
    this.userForm.patchValue({ identityTypeCd: value });
    this.userForm.get('identityTypeCd')?.markAsTouched();
  }

  // Handle gender selection change
  onGenderChange(value: any) {
    this.userForm.patchValue({ genderCd: value });
    this.userForm.get('genderCd')?.markAsTouched();
  }

  // Activate user
  handleActivate() {
    if (this.userData?.id) {
      this.isActivating = true;
      this.userService.activateUser(this.userData.id).subscribe({
        next: (response) => {
          console.log('User activated successfully:', response);
          this.isActivating = false;
          this.userData.statusFlg = 1; // Update local status
          this.userForm.patchValue({ statusFlg: 1 });
          this.onStatusChanged.emit();
          alert('Kích hoạt người dùng thành công!');
        },
        error: (error) => {
          console.error('Error activating user:', error);
          this.isActivating = false;
          alert('Có lỗi xảy ra khi kích hoạt người dùng!');
        }
      });
    }
  }

  // Deactivate user
  handleDeactivate() {
    if (this.userData?.id) {
      this.isDeactivating = true;
      this.userService.deactivateUser(this.userData.id).subscribe({
        next: (response) => {
          console.log('User deactivated successfully:', response);
          this.isDeactivating = false;
          this.userData.statusFlg = 0; // Update local status
          this.userForm.patchValue({ statusFlg: 0 });
          this.onStatusChanged.emit();
          alert('Hủy kích hoạt người dùng thành công!');
        },
        error: (error) => {
          console.error('Error deactivating user:', error);
          this.isDeactivating = false;
          alert('Có lỗi xảy ra khi hủy kích hoạt người dùng!');
        }
      });
    }
  }

  // Check if user is active
  isUserActive(): boolean {
    return this.userData?.statusFlg === 1;
  }

  protected readonly Number = Number;
}
