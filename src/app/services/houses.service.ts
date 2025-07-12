import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AirbnbListing } from '../types';

import { NavabrQuery } from '../types/navbar.type';
import { ListingService } from './http/listing.service.http';
import { modifyListing } from '../utils/listingUtil';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  private houseSubject: BehaviorSubject<AirbnbListing[]> = new BehaviorSubject<
    AirbnbListing[]
  >([]);
  private housesDataPermanent: AirbnbListing[] = [];
  private houseDataFilter: AirbnbListing[] = [];

  constructor(private listingService: ListingService) {}
  houseObserver$ = this.houseSubject.asObservable();

  updateHouse(houses: AirbnbListing[]) {
    this.houseSubject.next(houses);
  }
  updatOneHouse(house: AirbnbListing) {
    this.housesDataPermanent.unshift(house);
    this.houseSubject.next(this.housesDataPermanent);
  }

  updateHousesBasedOnQuery(navabrQuery: NavabrQuery) {
    this.houseDataFilter = this.housesDataPermanent.filter((house) => {
      const matchesLocation = this.queryLocation(house, navabrQuery);
      const matchesGuests = this.queryGuests(house, navabrQuery.quests);
      const matchesDate = this.queryDate(house, navabrQuery.date);

      return matchesLocation && matchesGuests && matchesDate;
    });

    this.updateHouse(this.houseDataFilter);
  }

  init() {
    this.listingService
      .getListings()
      .pipe(
        map(({ data }) => {
          return data.map((m) => {
            return modifyListing(m);
          });
        })
      )
      .subscribe({
        next: (houses) => {
          this.housesDataPermanent = houses;
          this.houseSubject.next(this.housesDataPermanent);
        },
      });
  }

  private queryDate(house: AirbnbListing, dateRange: string[]): boolean {
    if (!dateRange || dateRange.length !== 2 || !dateRange[0] || !dateRange[1])
      return true;

    const [startStr, endStr] = dateRange;
    const start = new Date(startStr);
    const end = new Date(endStr);

    const houseStart = new Date(house.availability.startDate);
    const houseEnd = new Date(house.availability.endDate);

    return houseStart <= start && houseEnd >= end;
  }

  private queryLocation(
    house: AirbnbListing,
    navabrQuery: NavabrQuery
  ): boolean {
    if (!navabrQuery.location || !navabrQuery.location.trim()) return true;

    const query = navabrQuery.location.toLowerCase();

    return (
      house.location.country.toLowerCase().startsWith(query) ||
      house.location.city.toLowerCase().startsWith(query) ||
      house.location.state.toLowerCase().startsWith(query)
    );
  }

  private queryGuests(house: AirbnbListing, guests: number): boolean {
    if (!guests || guests <= 0) return true;

    return house.features.guests >= guests;
  }
}
