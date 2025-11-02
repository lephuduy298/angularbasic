import { Routes } from '@angular/router';
import {AdminComponent} from './admin.component';
import {HomecomponentComponent} from './homecomponent/homecomponent.component';
import {AuthGuard} from '../../../core/guard/auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomecomponentComponent,
      },
      {
        path: 'orders',
        component: HomecomponentComponent,
      }
    ],
  }
];
