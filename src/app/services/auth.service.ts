import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggedInUserResDto } from '../types/user.type';
import { LocalStorageService } from './localStorage.service';
import { AUTH_KEY } from '../constants/app.constant';
import { UserService } from './http/user.service.http';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  private userSubject = new BehaviorSubject<LoggedInUserResDto | null>(null);
  public user$: Observable<LoggedInUserResDto | null> =
    this.userSubject.asObservable();
  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}

  setUser(user: LoggedInUserResDto): void {
    this.userSubject.next(user);
  }

  clearUser(): void {
    this.userSubject.next(null);
    this.localStorageService.clearStorage(AUTH_KEY);
  }

  // Get current value
  getCurrentUser(): LoggedInUserResDto | null {
    return this.userSubject.getValue();
  }

  public loadUserInnit(): Promise<void> {
    const tokens = this.localStorageService.getStorage(AUTH_KEY);
    if (!tokens) {
      this.userSubject.next(null);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.userService.getAuthDetails().subscribe({
        next: (user) => {
          this.userSubject.next(user.data);
          resolve();
        },
        error: () => {
          this.userSubject.next(null);
          resolve();
        },
      });
    });
  }
}
