import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    // Check for role-based access if required
    const requiredRole = route.data['role'];
    if (requiredRole) {
      const hasRole = authService.hasRole(requiredRole);
      if (!hasRole) {
        // Redirect to their own dashboard or home
        router.navigate([getRoleDashboardPath(authService)]);
        return false;
      }
    }
    return true;
  }

  // Not authenticated, redirect to login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated) {
    return true;
  }

  // Already authenticated, redirect to role-based dashboard
  router.navigate([getRoleDashboardPath(authService)]);
  return false;
};

function getRoleDashboardPath(authService: AuthService): string {
  const user = authService.currentUserValue;
  const code = user?.roles?.[0]?.code;
  switch (code) {
    case 'AGENT': return '/agent';
    case 'SUPERVISOR': return '/supervisor';
    case 'MANAGER': return '/manager';
    case 'ACCOUNTANT':
    case 'FINANCE': return '/accountant';
    case 'ADMIN': return '/admin';
    default: return '/';
  }
}
