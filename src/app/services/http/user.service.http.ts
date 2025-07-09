import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, LoginDto } from '../../types';
import { Observable } from 'rxjs';
import {
  AuthTokens,
  LoggedInUserResDto,
  RegisterDto,
} from '../../types/user.type';
import { environment } from '../../../environments/environment';
import { SKIP_CONTEXT, AUTH_KEY } from '../../constants/app.constant';
import { UpdateUserDto } from '../../types/user.type';
import { LocalStorageService } from '../localStorage.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}
  login(loginDto: LoginDto): Observable<ApiResponse<AuthTokens>> {
    let context = new HttpContext();
    context.set(SKIP_CONTEXT, true);
    return this.http.post<ApiResponse<AuthTokens>>(
      environment.LOGIN_URL,
      {
        ...loginDto,
      },
      { context }
    );
  }

  register(registerDto: RegisterDto): Observable<ApiResponse<any>> {
    let context = new HttpContext();
    context.set(SKIP_CONTEXT, true);
    return this.http.post<ApiResponse<any>>(
      environment.REGISTER_URL,
      {
        ...registerDto,
      },
      { context }
    );
  }

  getAuthDetails(): Observable<ApiResponse<LoggedInUserResDto>> {
    return this.http.get<ApiResponse<LoggedInUserResDto>>(
      environment.USER_LOGGED_URL,
      {
        responseType: 'json',
      }
    );
  }

  updateUser(
    updateUserDto: UpdateUserDto
  ): Observable<ApiResponse<LoggedInUserResDto>> {
    return this.http.patch<ApiResponse<LoggedInUserResDto>>(
      environment.USERS_URL,
      {
        ...updateUserDto,
      },
      {
        responseType: 'json',
      }
    );
  }

  deleteAccount(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(environment.USERS_URL, {
      responseType: 'json',
    });
  }
  refreshToken() {
    const context = new HttpContext().set(SKIP_CONTEXT, true);
    const refresh_token =
      this.localStorageService.getStorage(AUTH_KEY)?.refresh_token;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${refresh_token}`,
    });
    return this.http.get<ApiResponse<AuthTokens>>(
      environment.USERS_URL + '/refresh/token',
      { headers, context }
    );
  }
}
