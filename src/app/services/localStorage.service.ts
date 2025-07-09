import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setItem(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getStorage(key: string): any | null {
    let items = localStorage.getItem(key);
    if (items) {
      return JSON.parse(items);
    }
    return null;
  }

  clearStorage(key: string) {
    localStorage.removeItem(key);
  }
}
