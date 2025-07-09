import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiResponse } from '../../types/res.generic.type';
import { BookingResponseDTO, CreateBookingDTO } from '../../types';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  constructor(private http: HttpClient) {}

  createBooking(
    createBooking: CreateBookingDTO
  ): Observable<ApiResponse<CreateBookingDTO>> {
    return this.http.post<ApiResponse<CreateBookingDTO>>(
      environment.BOOKINGS_URL,
      {
        ...createBooking,
      }
    );
  }

  getBooking(id: number): Observable<ApiResponse<BookingResponseDTO>> {
    return this.http.get<ApiResponse<BookingResponseDTO>>(
      environment.BOOKINGS_URL + `/${id}`,
      {
        responseType: 'json',
      }
    );
  }
}
