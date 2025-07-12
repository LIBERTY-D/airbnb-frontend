import { AirbnbListing } from '../types';

export function modifyListing(data: AirbnbListing) {
  if (data.images?.main && typeof data.images.main === 'string') {
    if (!data.images.main.startsWith('data:image/')) {
      data.images.main = `data:image/png;base64,${data.images.main}`;
    }
  }

  if (Array.isArray(data.images?.gallery)) {
    data.images.gallery = data.images.gallery.map((g) => {
      if (typeof g === 'string') {
        return g.startsWith('data:image/') ? g : `data:image/png;base64,${g}`;
      }
      return g;
    }) as string[];
  }

  return data;
}
