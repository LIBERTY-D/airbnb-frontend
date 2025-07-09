export type Booking = {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  guests: number;
  total: number;
};

export type BookingResponseDTO = {
  bookingId: number;
  listingId: number;
  username: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  location: string;
  houseName: string;
  email: string;
  mainImage: string;
  numberOfGuests: number;
};
export type BookingFilterRes = {
  checkIn: string;
  checkOut: string;
};
export type CreateBookingDTO = {
  listingId: number;
  checkIn: Date;
  checkOut: Date;
  guests: number;
};
