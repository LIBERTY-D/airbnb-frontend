// swipe-right.directive.ts
import {
  Directive,
  HostListener,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { AirbnbListing } from '../types';

@Directive({
  selector: '[appSwipeRight]',
  standalone: true,
})
export class SwipeRightDirective {
  @Input() data!: AirbnbListing;
  @Output() swipeRight = new EventEmitter<AirbnbListing>();

  private touchStartX = 0;
  private screenThreshold = 768; // px, for small screens

  constructor() {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].screenX;
    const deltaX = touchEndX - this.touchStartX;

    const isSmallScreen = window.innerWidth <= this.screenThreshold;
    if (isSmallScreen && deltaX > 50) {
      this.swipeRight.emit(this.data);
    }
  }
}
