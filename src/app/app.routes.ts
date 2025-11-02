import { Routes } from '@angular/router';
import {LogincomponentComponent} from './features/logincomponent/logincomponent.component';
import {adminRoutes} from './features/admin/admin.routes';
import {HomepageComponent} from './features/pages/homepage/homepage.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  ...adminRoutes,
  { path: 'login', component: LogincomponentComponent },
  { path: 'home', component: HomepageComponent}
];
