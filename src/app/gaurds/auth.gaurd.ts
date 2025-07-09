import { inject } from '@angular/core';

import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthUserService } from '../services/auth.service';

export const authGaurd = () => {
  const authService = inject(AuthUserService);
  const router = inject(Router);

  return authService.user$.pipe(
    map((user) => {
      if (user) return true;
      return router.createUrlTree(['/login']);
    })
  );
};
