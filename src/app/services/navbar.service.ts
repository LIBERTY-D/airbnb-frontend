import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavBarService {
  private navbarSubj: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  public navbarObserver$: Observable<boolean> = this.navbarSubj.asObservable();

  public showNavbar() {
    this.navbarSubj.next(true);
  }
  public hideNavbar() {
    this.navbarSubj.next(false);
  }
}
