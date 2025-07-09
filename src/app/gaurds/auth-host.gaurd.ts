import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUserService } from '../services/auth.service';
import { map } from 'rxjs';
import { LoggedInUserResDto } from '../types';

export const authHostGaurd = () => {
  const authService = inject(AuthUserService);
  const router = inject(Router);

  return authService.user$.pipe(
    map((user) => {
      if (user && !hasRole(user)) {
        return router.createUrlTree(['/']);
      }
      return true;
    })
  );
};

function hasRole(user: LoggedInUserResDto) {
  return user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_HOST');
}
