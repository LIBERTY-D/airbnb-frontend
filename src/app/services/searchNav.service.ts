import { Injectable } from '@angular/core';
import { NavabrQuery } from '../types/navbar.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchNavBarService {
  private querySubject: BehaviorSubject<NavabrQuery | null> =
    new BehaviorSubject<NavabrQuery | null>(null);

  navQueryObserver$ = this.querySubject.asObservable();

  updateSearQuery(query: NavabrQuery) {}
}
