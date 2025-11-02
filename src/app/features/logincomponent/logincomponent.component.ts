import {Component, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router} from '@angular/router';

export interface LoginUser {
  username: string;
  password: string;
}

export interface UserResponse{
  username : string;
  role: string;
}

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

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.authService.login(this.formLogin.value).subscribe(res => {
      if (res.success) {
        console.log('Đăng nhập thành công', res.data);
        if(res.data.role == 'admin'){
          this.router.navigate(['admin']);
        }
        else {
          this.router.navigate(['home']);
        }

      } else {
        console.log('Username hoặc mật khẩu không đúng');
      }
    });
    console.log(this.formLogin.value);
  }
}
