import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AirbnbListing, CreateBookingDTO } from '../../types';
import { SharedModule } from '../../../module/shared.module';

@Component({
  selector: 'app-air-bnb-details-card',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './air-bnb-details-card.component.html',
  styleUrl: './air-bnb-details-card.component.css',
})
export class AirBnbDetailsCardComponent implements OnChanges {
  flatpickrConfig = {};
  @Input() airDetailsListing: AirbnbListing | undefined = undefined;
  @Output() reserveHouseEvent: EventEmitter<CreateBookingDTO> =
    new EventEmitter();
  galleryImages: string[] = [];
  selectedDates: Date[] = [];
  guests: number = 1;
  totalNights: number = 0;
  totalPrice: number = 0;

  onDateChange(dates: Date[]) {
    this.selectedDates = dates;
    if (dates.length === 2) {
      const [start, end] = dates;
      const timeDiff = Math.abs(end.getTime() - start.getTime());
      this.totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    } else {
      this.totalNights = 0;
    }

    this.updateTotal();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['airDetailsListing'] &&
      this.airDetailsListing?.images?.gallery
    ) {
      this.galleryImages = this.airDetailsListing.images.gallery as string[];
      let newDate =
        new Date(
          this.airDetailsListing?.availability?.startDate as string
        ).getTime() < Date.now()
          ? new Date()
          : new Date(this.airDetailsListing?.availability?.startDate as string);
      this.flatpickrConfig = {
        mode: 'range',
        inline: true,
        minDate: newDate,
        maxDate: this.airDetailsListing.availability?.endDate,
        disable:
          this.airDetailsListing.bookings?.map((b) => ({
            from: new Date(b.checkIn),
            to: new Date(b.checkOut),
          })) || [],
      };
    }
  }

  updateTotal() {
    const perNight = this.airDetailsListing?.pricing?.perNight || 0;
    this.totalPrice = perNight * this.totalNights;
  }
  bookHouse() {
    if (this.airDetailsListing) {
      const [start, end] = this.selectedDates;
      this.reserveHouseEvent.emit({
        checkIn: start,
        checkOut: end,
        listingId: this.airDetailsListing.id,
        guests: this.guests,
      });
    }
  }
}
