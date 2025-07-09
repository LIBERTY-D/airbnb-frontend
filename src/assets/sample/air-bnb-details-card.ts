import { AirbnbListing } from "../../app/types";

export const listing: AirbnbListing = {
  id:0,
  title: "Spacious & Cozy Cabin with Mountain Views",
  location: {
    city: "Asheville",
    state: "North Carolina",
    country: "United States",
  },
  images: {
    main: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=600&auto=format&fit=crop&q=60",
    gallery: [
      "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=600&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=600&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=600&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=600&auto=format&fit=crop&q=60",
    ],
  },
  host: {
    name: "Jane Doe",
    joinedYear: 2022,
    isSuperhost: true,
  },
  features: {
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    wifi: true,
    fireplace: true,
    mountainView: true,
  },
  description:
    "Enjoy a peaceful getaway in this spacious cabin with mountain views, a full kitchen, cozy fireplace, and private deck. Perfect for families and nature lovers.",
  amenities: [
    "Washer & Dryer",
    "Fully Equipped Kitchen",
    "Air Conditioning",
    "Pet Friendly",
  ],
  pricing: {
    perNight: 125,
    rating: 4.9,
  },
  availability: {
    startDate: '', 
    endDate: '',
  },
};
