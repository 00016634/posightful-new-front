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
      // Some roles share a route (e.g. ACCOUNTANT and FINANCE both use /accountant)
      const roleAliases: Record<string, string[]> = {
        'ACCOUNTANT': ['ACCOUNTANT', 'FINANCE'],
      };
      const acceptedRoles = roleAliases[requiredRole] || [requiredRole];
      const hasRole = acceptedRoles.some(r => authService.hasRole(r));
      if (!hasRole) {
        // Redirect to their own dashboard or home
        const dashPath = getRoleDashboardPath(authService);
        router.navigate([dashPath]);
        return false;
      }
    }
    return true;
  }

  // Not authenticated, redirect to login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Guard for the root `/` route (onboarding/role-selector).
 * If the user already has a role, skip the role-selector and go to their dashboard.
 */
export const onboardingGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // If user has a role, redirect to their dashboard — skip role-selector
  const dashPath = getRoleDashboardPath(authService);
  if (dashPath !== '/') {
    router.navigate([dashPath]);
    return false;
  }

  // No role assigned yet — show role-selector
  return true;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated) {
    return true;
  }

  // Already authenticated, redirect to role-based dashboard
  const dashPath = getRoleDashboardPath(authService);
  router.navigate([dashPath]);
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
