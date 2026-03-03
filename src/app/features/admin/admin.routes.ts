import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent),
  },
  {
    path: 'users/:userId',
    loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./product-management/product-management.component').then(m => m.ProductManagementComponent),
  },
  {
    path: 'regions',
    loadComponent: () => import('./region-management/region-management.component').then(m => m.RegionManagementComponent),
  },
];
