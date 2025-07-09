import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthUserService } from '../services/auth.service';
import { Router } from '@angular/router';
import {  NavBarService } from '../services/navbar.service';

export const preventEnteringPage = () => {
  const authService = inject(AuthUserService);
  const navBarService =  inject(NavBarService)
  const router=  inject(Router)

  return authService.user$.pipe(
    map((user) => {
      if (user) {
        navBarService.showNavbar()
         router.navigate([""])
        return false
      };
      return true;
    })
  );
};
