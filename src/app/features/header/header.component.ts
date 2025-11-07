import {Component, OnInit, inject, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {User} from '../../models/user.model';
import {AuthService} from '../../../core/services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {
  isProductMenuOpen = false;
  isMobileMenuOpen = false;
  isMobileProductMenuOpen = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  private subscription: Subscription | undefined;

  ngOnInit() {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
    this.router.navigate(['/login']);
  }
}
