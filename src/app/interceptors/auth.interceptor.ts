import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { AUTH_KEY, SKIP_CONTEXT } from '../constants/app.constant';
import { LocalStorageService } from '../services/localStorage.service';
import { AuthTokens } from '../types';
import { AuthUserService } from '../services/auth.service';
import { UserService } from '../services/http/user.service.http';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const storage = inject(LocalStorageService);
  const authService = inject(AuthUserService);
  const userService = inject(UserService);
  const skipAuth = req.context.get(SKIP_CONTEXT);

  console.log('[INTECERPTOR]');
  const tokens = storage.getStorage(AUTH_KEY);
  const token = tokens?.access_token;

  const authReq = skipAuth
    ? req
    : req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !skipAuth &&
        error.error &&
        error.error.message.includes('token expired')
      ) {
        return userService.refreshToken().pipe(
          switchMap((tokenResponse) => {
            const newAccessToken = tokenResponse.data.access_token;
            storage.setItem(AUTH_KEY, tokenResponse.data);
            const retryReq = req.clone({
              headers: new HttpHeaders({
                Authorization: `Bearer ${newAccessToken}`,
              }),
            });

            return next(retryReq);
          }),
          catchError((refreshError) => {
            if (
              (refreshError.status === 401 || refreshError.status === 500) &&
              refreshError.error.message.includes('JWT expired')
            ) {
              authService.clearUser();
            }
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
