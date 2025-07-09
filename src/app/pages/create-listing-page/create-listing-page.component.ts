import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NavBarService } from '../../services/navbar.service';
import { handleError } from '../../utils/errUtil';
import { ToastService } from '../../services/toast.service';
import { HouseService } from '../../services/houses.service';
import { AirbnbListing } from '../../types';
import { HttpErrorResponse } from '@angular/common/http';
import { ListingService } from '../../services/http/listing.service.http';

@Component({
  selector: 'app-create-listing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-listing-page.component.html',
  styleUrls: ['./create-listing-page.component.css'],
})
export class CreateListingPageComponent implements OnInit {
  listingForm: FormGroup;

  mainImagePreview: string | null = null;
  mainImageFile: null | File = null;
  galleryImagePreviews: string[] = [];
  statusMessage: string | null = null;
  statusClass: string = 'bg-green-100 text-green-800';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private navBarService: NavBarService,
    private listingService: ListingService,
    private toastService: ToastService,
    private houseService: HouseService
  ) {
    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      location: this.fb.group({
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
      }),
      images: this.fb.group({
        main: ['', Validators.required],
        gallery: this.fb.array([]),
      }),
      host: this.fb.group({
        name: ['', Validators.required],
        joinedYear: [
          new Date().getFullYear(),
          [Validators.required, Validators.min(1900)],
        ],
        isSuperhost: [false],
      }),
      features: this.fb.group({
        bedrooms: [1, [Validators.required, Validators.min(0)]],
        bathrooms: [1, [Validators.required, Validators.min(0)]],
        guests: [1, [Validators.required, Validators.min(1)]],
        wifi: [false],
        fireplace: [false],
        mountainView: [false],
      }),
      description: ['', Validators.required],
      amenities: ['', Validators.required],
      pricing: this.fb.group({
        perNight: [100, [Validators.required, Validators.min(1)]],
        rating: [
          5.0,
          [Validators.required, Validators.min(0), Validators.max(5)],
        ],
      }),
      availability: this.fb.group({
        startDate: [null],
        endDate: [null],
      }),
    });
  }
  ngOnInit(): void {
    this.navBarService.hideNavbar();
  }

  get gallery(): FormArray {
    return this.listingForm.get('images.gallery') as FormArray;
  }

  get galleryControls(): FormControl[] {
    return this.gallery.controls as FormControl[];
  }
  onMainImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      this.mainImagePreview = null;

      this.listingForm.get('images.main')?.setValue('');
      return;
    }

    const file = input.files[0];
    this.mainImageFile = file;
    const previewUrl = URL.createObjectURL(file);
    this.mainImagePreview = previewUrl;
  }

  onGalleryImagesSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    const galleryArray = this.listingForm.get('images.gallery') as FormArray;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        galleryArray.push(new FormControl(file));
        const previewUrl = URL.createObjectURL(file);
        this.galleryImagePreviews.push(previewUrl);
      }
    }
  }

  removeGalleryImage(index: number) {
    const galleryArray = this.gallery;
    galleryArray.removeAt(index);
    // Clean up object URL
    URL.revokeObjectURL(this.galleryImagePreviews[index]);
    this.galleryImagePreviews.splice(index, 1);
  }

  createListing(): void {
    if (this.listingForm.invalid) {
      this.statusMessage = 'Please fill out all required fields correctly.';
      this.statusClass = 'bg-red-100 text-red-800';
      return;
    }

    const formValue = this.listingForm.value;
    const listingDto = {
      title: formValue.title,
      city: formValue.location.city || 'unknown',
      state: formValue.location.state || 'unknown',
      country: formValue.location.country || 'unknown',
      mainImage: '',
      gallery: [],
      hostName: formValue.host.name,
      hostJoinedYear: formValue.host.joinedYear,
      isSuperhost: formValue.host.isSuperhost,
      bedrooms: formValue.features.bedrooms,
      bathrooms: formValue.features.bathrooms,
      guests: formValue.features.guests,
      wifi: formValue.features.wifi,
      fireplace: formValue.features.fireplace,
      mountainView: formValue.features.mountainView,
      description: formValue.description,
      amenities: formValue.amenities
        .split(',')
        .map((a: string) => a.trim())
        .filter((a: string) => a),
      perNight: formValue.pricing.perNight,
      rating: formValue.pricing.rating,
      startDate: formValue.availability.startDate,
      endDate: formValue.availability.endDate,
    };

    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(listingDto)], {
      type: 'application/json',
    });
    formData.append('ListingDTO', jsonBlob);

    formValue.images.gallery.forEach((file: File) => {
      formData.append('gallery', file);
    });
    formData.append('main', this.mainImageFile as File);
    this.listingService.createListingFormData(formData).subscribe({
      next: (res: { data: AirbnbListing }) => {
        this.toastService.show('success creation of your airbnb', 'success');
        this.houseService.updatOneHouse(res.data);
        setTimeout(() => {
          this.router.navigate(['']);
          this.resetForm();
          this.mainImagePreview = null;
          this.galleryImagePreviews = [];
        }, 5000);
      },
      error: (err: HttpErrorResponse) => {
        handleError(err, this.toastService);
      },
    });
  }

  resetForm() {
    this.listingForm.reset({
      host: {
        joinedYear: new Date().getFullYear(),
        isSuperhost: false,
        name: '',
      },
      features: {
        bedrooms: 1,
        bathrooms: 1,
        guests: 1,
        wifi: false,
        fireplace: false,
        mountainView: false,
      },
      pricing: {
        perNight: 100,
        rating: 5.0,
      },
      availability: {
        startDate: null,
        endDate: null,
      },
      amenities: '',
      title: '',
      location: {
        city: '',
        state: '',
        country: '',
      },
      images: {
        main: '',
      },
    });
  }

  goBackToHomePage() {
    this.router.navigate(['home']);
    this.navBarService.showNavbar();
  }
}
