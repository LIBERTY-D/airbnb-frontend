import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BecomeHostService {
  constructor(private http: HttpClient) {}

  becomeHost(data: { email: string }): Observable<ApiResponse<object>> {
    return this.http.post<ApiResponse<object>>(
      environment.BASE_URL + '/host',
      data
    );
  }
}
