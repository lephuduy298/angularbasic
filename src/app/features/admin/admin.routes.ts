import { Routes } from '@angular/router';
import {AdminComponent} from './admin.component';
import {UsersComponent} from './users/users.component';
import {UserHistoryComponent} from './user-history/user-history.component';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/:id/history',
        component: UserHistoryComponent,
      }
    ],
  }
];
