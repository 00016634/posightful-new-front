import { Routes } from '@angular/router';

export const accountantRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./accountant-dashboard/accountant-dashboard.component').then(m => m.AccountantDashboardComponent),
  },
];
