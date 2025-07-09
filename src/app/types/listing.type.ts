export interface ListingDTO {
  title: string;
  city: string;
  state: string;
  country: string;
  mainImage: string;
  gallery: string[];
  hostName: string;
  hostJoinedYear: number;
  isSuperhost: boolean;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  wifi: boolean;
  fireplace: boolean;
  mountainView: boolean;
  description: string;
  amenities: string[];
  perNight: number;
  rating: number;
  startDate: string;
  endDate: string;
}
export interface PartialListingUpdateDTO {
  title?: string;
  city?: string;
  state?: string;
  country?: string;
  mainImage?: string;
  gallery?: string[];
  hostName?: string;
  hostJoinedYear?: number;
  isSuperhost?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  guests?: number;
  wifi?: boolean;
  fireplace?: boolean;
  mountainView?: boolean;
  description?: string;
  amenities?: string[];
  perNight?: number;
  rating?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}
