import { HttpContextToken } from '@angular/common/http';

export const FAV_KEY = 'airbnb-favourites';
export const AUTH_KEY = 'airbnb-auth';
export const SKIP_CONTEXT = new HttpContextToken<boolean>(() => false);
