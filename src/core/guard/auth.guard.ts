// auth.guard.ts

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('userG');
    if (user) return true;

    this.router.navigate(['/login']);
    return false;
  }



}
