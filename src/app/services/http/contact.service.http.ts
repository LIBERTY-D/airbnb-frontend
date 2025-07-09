import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Contact } from '../../types';
import { SKIP_CONTEXT } from '../../constants/app.constant';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient) {}

  contactUs(contact: Contact): Observable<ApiResponse<object>> {
    let context = new HttpContext().set(SKIP_CONTEXT, true);
    return this.http.post<ApiResponse<object>>(
      environment.BASE_URL + '/contact',
      {
        ...contact,
      },
      { context }
    );
  }
}
