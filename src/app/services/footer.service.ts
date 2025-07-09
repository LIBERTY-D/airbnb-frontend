import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private footerSubj: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  public footerObserver$: Observable<boolean> = this.footerSubj.asObservable();

  public showFooter() {
    this.footerSubj.next(true);
  }
  public hideFooter() {
    this.footerSubj.next(false);
  }
}
