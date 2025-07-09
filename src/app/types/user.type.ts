import { BookingResponseDTO } from './booking.type';
import { AirbnbListing } from './air-bnb-details-card.type';

export type User = {
  name: string;
  email: string;
  phone: string;
  joinedYear: number;
  isSuperhost: boolean;
};

export type LoginDto = {
  email: string;
  password: string;
};

export interface RegisterDto {
  name: string;
  email: string;
  joinedYear: number;
  password: string;
  confirmPassword: string;
}
export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  joinedYear?: number;
  superhost?: boolean;
  password?: string;
}

export interface LoggedInUserResDto {
  userId: number;
  verified: boolean;
  registerToken: string | null;
  provider: 'LOCAL' | 'GOOGLE' | 'GITHUB';
  name: string;
  email: string;
  phone: string | null;
  roles: string[];
  joinedYear: number;
  password: string;
  listings: AirbnbListing[];
  bookings: BookingResponseDTO[];
  superhost: boolean;
}

export interface AuthTokens {
  refresh_token: string;
  access_token: string;
}
