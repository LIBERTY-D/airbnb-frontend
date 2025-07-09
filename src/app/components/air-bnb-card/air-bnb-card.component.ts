import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AirbnbListing, LoggedInUserResDto } from '../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-air-bnb-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './air-bnb-card.component.html',
  styleUrl: './air-bnb-card.component.css',
})
export class AirBnbCardComponent {
  @Input() airBnb!: AirbnbListing;
  @Output() favEvent: EventEmitter<AirbnbListing> = new EventEmitter();
  @Output() hostHouseEvent: EventEmitter<AirbnbListing> = new EventEmitter();
  @Input () loggedInUser:LoggedInUserResDto|null =null
  clickFavouritesIcon(event: Event) {
    event.stopPropagation();
    this.favEvent.emit(this.airBnb);
  }
  goToHostPage() {
    this.hostHouseEvent.emit(this.airBnb);
  }
}
