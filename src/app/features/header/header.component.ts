import {Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {UserResponse} from '../logincomponent/logincomponent.component';
import {AuthService} from '../../../core/services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent implements OnInit {
  isProductMenuOpen = false;
  isMobileMenuOpen = false;
  isMobileProductMenuOpen = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: UserResponse | null = {} as UserResponse;
  private subscription: Subscription | undefined;

  ngOnInit() {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    })
  }

  setCurrentUser() {
    const stored = localStorage.getItem("userG");
    this.currentUser = stored ? JSON.parse(stored) : null;
  }

  toggleProductMenu(): void {
    this.isProductMenuOpen = !this.isProductMenuOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleMobileProductMenu(): void {
    this.isMobileProductMenuOpen = !this.isMobileProductMenuOpen;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.setCurrentUser();  // ← Cập nhật lại currentUser ngay sau khi logout
    this.router.navigate(['/']);
  }
}
