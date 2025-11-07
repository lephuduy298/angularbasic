import { Routes } from '@angular/router';
import {AdminComponent} from './admin.component';
import {UsersComponent} from './users/users.component';
import {AuthGuard} from '../../../core/guard/auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
      }
    ],
  }
];
