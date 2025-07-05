import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { authenticationGuard } from './guards/authentication.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [authenticationGuard],
  },
  { path: '**', redirectTo: '/login' },
];
