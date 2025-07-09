import { Component, Input } from '@angular/core';
import { BookingResponseDTO } from '../../types';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [],
  templateUrl: './booking-card.component.html',
  styleUrl: './booking-card.component.css',
})
export class BookingCardComponent {
  @Input() booking!: BookingResponseDTO;

  formatDate(date: string) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  }
}
