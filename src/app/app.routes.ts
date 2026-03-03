import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/onboarding/onboarding.routes').then(m => m.onboardingRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'purchase',
    loadChildren: () => import('./features/onboarding/onboarding.routes').then(m => m.purchaseRoutes),
  },
  {
    path: 'agent',
    loadChildren: () => import('./features/agent/agent.routes').then(m => m.agentRoutes),
    canActivate: [authGuard],
    data: { role: 'AGENT' },
  },
  {
    path: 'supervisor',
    loadChildren: () => import('./features/supervisor/supervisor.routes').then(m => m.supervisorRoutes),
    canActivate: [authGuard],
    data: { role: 'SUPERVISOR' },
  },
  {
    path: 'manager',
    loadChildren: () => import('./features/manager/manager.routes').then(m => m.managerRoutes),
    canActivate: [authGuard],
    data: { role: 'MANAGER' },
  },
  {
    path: 'accountant',
    loadChildren: () => import('./features/accountant/accountant.routes').then(m => m.accountantRoutes),
    canActivate: [authGuard],
    data: { role: 'ACCOUNTANT' },
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
