import { Routes } from '@angular/router';

export const supervisorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./supervisor-dashboard/supervisor-dashboard.component').then(m => m.SupervisorDashboardComponent),
  },
  {
    path: 'all-leads',
    loadComponent: () => import('./all-leads/all-leads.component').then(m => m.AllLeadsComponent),
  },
  {
    path: 'person-info',
    loadComponent: () => import('./supervisor-person-info/supervisor-person-info.component').then(m => m.SupervisorPersonInfoComponent),
  },
  {
    path: 'conversation-logs',
    loadComponent: () => import('./conversation-logs/conversation-logs.component').then(m => m.ConversationLogsComponent),
  },
];
