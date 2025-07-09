import { Component, Input } from '@angular/core';
import { AirbnbListing } from '../../types';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-listing-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-listing-card.component.html',
})
export class MyListingCardComponent {
  @Input() listing: AirbnbListing | undefined = undefined;
  getStringGalleryImages(gallery: (string | File)[]): string[] {
    return gallery.filter((g): g is string => typeof g === 'string');
  }
}
