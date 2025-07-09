import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FavCard } from '../types';
import { LocalStorageService } from './localStorage.service';
import { ToastService } from './toast.service';
import { FAV_KEY } from '../constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private favSubject: BehaviorSubject<FavCard[]> = new BehaviorSubject<
    FavCard[]
  >([]);

  private favaCardData: FavCard[] = [];

  favObserver$ = this.favSubject.asObservable();

  constructor(
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) {
    this.init();
  }

  updateFavourites(data: FavCard) {
    let storageData = this.localStorageService.getStorage(FAV_KEY);
    if (storageData) {
      this.favaCardData = storageData;
      let checkExist = this.favaCardData.find((fav) => fav.id == data.id);
      if (checkExist) {
        this.toastService.show(
          'already added this property to favourites',
          'success'
        );
      } else {
        this.favaCardData.unshift(data);
        this.toastService.show(data.title + ' added to favourites', 'success');
      }

      this.emiteData();
    } else {
      this.favaCardData.unshift(data);
      this.emiteData();
    }
  }

  removeFromFavourites(id: number) {
    this.favaCardData = this.favaCardData.filter((fav) => fav.id !== id);
    this.emiteData();
    this.toastService.show('removed the property from favourites', 'success');
  }

  private emiteData() {
    this.favSubject.next(this.favaCardData);
    this.localStorageService.setItem(FAV_KEY, this.favaCardData);
  }

  private init() {
    let storedData = this.localStorageService.getStorage(FAV_KEY);
    if (storedData) {
      this.favaCardData = storedData as FavCard[];
      this.favSubject.next(this.favaCardData);
    }
  }
}
