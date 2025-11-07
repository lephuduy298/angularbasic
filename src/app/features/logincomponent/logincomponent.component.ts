import {Component, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router} from '@angular/router';
import {LoginRequest} from '../../models/user.model';

@Component({
  selector: 'app-logincomponent',
  imports: [
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './logincomponent.component.html',
  styleUrl: './logincomponent.component.scss',
  standalone: true
})
export class LogincomponentComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  showPassword: boolean = false;
  formLogin!: FormGroup;
  errorMessage: string = '';

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.formLogin.invalid) {
      return;
    }

    const loginData: LoginRequest = this.formLogin.value;

    this.authService.login(loginData).subscribe(res => {
      if (res.success && res.data) {
        console.log('Đăng nhập thành công', res.data);
        // Check role if it exists, otherwise navigate to admin by default
        if(res.data.role && res.data.role === 'admin'){
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.errorMessage = res.message || 'Username hoặc mật khẩu không đúng';
        console.log(this.errorMessage);
      }
    });
  }
}
