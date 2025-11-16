import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserRequest } from '../../../models/user.model';
import { SelectModalComponent, SelectOption } from '../select-modal/select-modal.component';

@Component({
  selector: 'app-form-create-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModalComponent],
  templateUrl: './form-create-user-modal.component.html',
  styleUrl: './form-create-user-modal.component.scss'
})
export class FormCreateUserModalComponent implements OnInit {
  @Input() companyOptions: SelectOption[] = [];
  @Input() departmentOptions: SelectOption[] = [];

  @Output() onSubmit = new EventEmitter<CreateUserRequest>();
  @Output() onCancel = new EventEmitter<void>();

  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
      password: ['', [
        Validators.required,
        Validators.maxLength(18)
      ]],
      fullName: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
       departmentId: [null, [Validators.required]],
      companyProfileId: [null, [Validators.required]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  handleSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      // Ensure departmentId and companyProfileId are numbers
      const payload: CreateUserRequest = {
        ...formValue,
        departmentId: Number(formValue.departmentId),
        companyProfileId: Number(formValue.companyProfileId)
      };
      console.log('Submitting user data:', payload);
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
        default: return 'Trường này không được để trống';
      }
    }
    if (control?.hasError('maxLength')) {
      switch (fieldName) {
        case 'userName': return 'Tên tài khoản không được quá 18 ký tự';
        case 'password': return 'Mật khẩu không được quá 18 ký tự';
        case 'fullName': return 'Họ và tên không được quá 50 ký tự';
        case 'description': return 'Độ dài không quá 255 ký tự';
        default: return 'Vượt quá độ dài cho phép';
      }
    }
    if (control?.hasError('email')) {
      return 'Email không đúng định dạng';
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
}
