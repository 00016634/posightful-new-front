import { Routes } from '@angular/router';

export const agentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./agent-dashboard/agent-dashboard.component').then(m => m.AgentDashboardComponent),
  },
  {
    path: 'create-lead',
    loadComponent: () => import('./create-lead/create-lead.component').then(m => m.CreateLeadComponent),
  },
  {
    path: 'person-info',
    loadComponent: () => import('./person-info/person-info.component').then(m => m.PersonInfoComponent),
  },
  {
    path: 'bonuses-details',
    loadComponent: () => import('./bonuses-details/bonuses-details.component').then(m => m.BonusesDetailsComponent),
  },
];
