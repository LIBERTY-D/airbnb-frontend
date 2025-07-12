import { AirbnbListing } from '../types';
export function modifyListing(data: AirbnbListing) {
  if (data.images?.main) {
    data.images.main = `data:image/png;base64,${data.images.main}`;
  }

  if (Array.isArray(data.images?.gallery)) {
    data.images.gallery = data.images.gallery.map(
      (g) => `data:image/png;base64,${g}`
    );
  }

  return data;
}
