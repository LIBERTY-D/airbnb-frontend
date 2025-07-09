import { Component, Input } from '@angular/core';
import { AirbnbListing } from '../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-host-management-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './host-management-card.component.html',
  styleUrl: './host-management-card.component.css',
})
export class HostManagementCardComponent {
  @Input() previewGalleryImages: string[] = [];
  @Input() listing: AirbnbListing | undefined = undefined;
  @Input() onMainImageSelected!: (event: Event, listing: AirbnbListing) => void;
  @Input() removeGalleryImage!: (listing: AirbnbListing, index: number) => void;
  @Input() addGalleryImage!: (listing: AirbnbListing) => void;
  @Input() openEditModal!: (listing: AirbnbListing, field: string) => void;
  @Input() saveEdit!: () => void;
  @Input() deleteListing!: (listing: AirbnbListing) => void;
  @Input() removeMainImage!: (listing: AirbnbListing) => void;
  @Input() onGalleryImageSelected!: (
    event: Event,
    listing: AirbnbListing,
    index: number
  ) => void;
}
