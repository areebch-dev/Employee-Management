import { Routes } from '@angular/router';
import { Employees } from './employees/employees';
import { LoginComponent } from './auth/login/login';
import { SignUp } from './auth/signup/signup';

export const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignUp },
  { path: 'employees', component: Employees },
];
