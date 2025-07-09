import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListingDTO } from '../../types/listing.type';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../types/res.generic.type';
import { AirbnbListing } from '../../types';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ListingService {
  constructor(private http: HttpClient) {}

  createListing(
    listingDTO: ListingDTO
  ): Observable<ApiResponse<AirbnbListing>> {
    return this.http.post<ApiResponse<AirbnbListing>>(
      environment.LISTINGS_URL,
      {
        ...listingDTO,
      }
    );
  }
  createListingFormData(
    formData: FormData
  ): Observable<ApiResponse<AirbnbListing>> {
    return this.http.post<ApiResponse<AirbnbListing>>(
      environment.LISTINGS_URL,
      formData
    );
  }
  updateListing(
    id: number,
    formData: FormData
  ): Observable<ApiResponse<AirbnbListing>> {
    return this.http.patch<ApiResponse<AirbnbListing>>(
      `${environment.LISTINGS_URL}/${id}`,
      formData
    );
  }

  getListings(): Observable<ApiResponse<AirbnbListing[]>> {
    return this.http.get<ApiResponse<AirbnbListing[]>>(
      environment.LISTINGS_URL
    );
  }

  getListing(id: number): Observable<ApiResponse<AirbnbListing>> {
    return this.http.get<ApiResponse<AirbnbListing>>(
      environment.LISTINGS_URL + `/${id}`
    );
  }
  deleteListing(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      environment.LISTINGS_URL + `/${id}`
    );
  }
}
