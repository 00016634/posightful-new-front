import { Routes } from '@angular/router';

export const managerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent),
  },
  {
    path: 'all-agents',
    loadComponent: () => import('./all-agents/all-agents.component').then(m => m.AllAgentsComponent),
  },
  {
    path: 'product-funnel',
    loadComponent: () => import('./product-funnel/product-funnel.component').then(m => m.ProductFunnelComponent),
  },
  {
    path: 'bonus-management',
    loadComponent: () => import('./bonus-management/bonus-management.component').then(m => m.BonusManagementComponent),
  },
  {
    path: 'bonus-management/month/:month',
    loadComponent: () => import('./monthly-bonus-detail/monthly-bonus-detail.component').then(m => m.MonthlyBonusDetailComponent),
  },
  {
    path: 'bonus-management/rules',
    loadComponent: () => import('./bonus-rules/bonus-rules.component').then(m => m.BonusRulesComponent),
  },
  {
    path: 'bonus-management/rules/:ruleId',
    loadComponent: () => import('./bonus-rule-form/bonus-rule-form.component').then(m => m.BonusRuleFormComponent),
  },
  {
    path: 'bonus-management/attribution-window',
    loadComponent: () => import('./attribution-window/attribution-window.component').then(m => m.AttributionWindowComponent),
  },
  {
    path: 'conversation-logs',
    loadComponent: () => import('./conversation-logs/conversation-logs.component').then(m => m.ManagerConversationLogsComponent),
  },
  {
    path: ':role/:id',
    loadComponent: () => import('./agent-detail/agent-detail.component').then(m => m.AgentDetailComponent),
  },
];
