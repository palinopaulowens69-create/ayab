import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/models';

export const roleGuard = (role: Role): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasRole(role)) {
    return true;
  }

  const currentUser = auth.user();
  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  return router.createUrlTree([currentUser.role === 'admin' ? '/admin/dashboard' : `/${currentUser.role}/home`]) as UrlTree;
};
