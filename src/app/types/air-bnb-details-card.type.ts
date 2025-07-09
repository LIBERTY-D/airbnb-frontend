import { Booking, BookingFilterRes } from './booking.type';

export interface AirbnbListing {
  id: number;
  userId: number;
  title: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  images: {
    main: string;
    gallery: File[] | string[];
  };
  host: {
    name: string;
    joinedYear: number;
    isSuperhost: boolean;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    guests: number;
    wifi: boolean;
    fireplace: boolean;
    mountainView: boolean;
  };
  description: string;
  amenities: string[];
  pricing: {
    perNight: number;
    rating: number;
  };
  availability: {
    startDate: Date | string;
    endDate: Date | string;
  };
  bookings: BookingFilterRes[];
}

export type Listing = {
  id: number;
  title: string;
  location: string;
  price: number;
  mainImage: string;
  gallery: string[];
};
