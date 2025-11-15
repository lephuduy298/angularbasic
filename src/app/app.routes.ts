import { Routes } from '@angular/router';
import {LogincomponentComponent} from './features/logincomponent/logincomponent.component';
import {adminRoutes} from './features/admin/admin.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  ...adminRoutes,
  { path: 'login', component: LogincomponentComponent },
];
