import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AirbnbListing, FavCard, LoggedInUserResDto } from '../../types';
import { CommonModule } from '@angular/common';

import { HostManagementCardComponent } from '../../components/host-management-card/host-management-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NavBarService } from '../../services/navbar.service';
import { HouseService } from '../../services/houses.service';
import { PartialListingUpdateDTO } from '../../types/listing.type';
import { ListingService } from '../../services/http/listing.service.http';
import { handleError } from '../../utils/errUtil';
import { ToastService } from '../../services/toast.service';
import { sucessHandler } from '../../utils/sucessUtil';
import { base64ToFile } from '../../utils/toBase64';
import { LocalStorageService } from '../../services/localStorage.service';
import { FAV_KEY } from '../../constants/app.constant';
import { map } from 'rxjs';
import { modifyListing } from '../../utils/listingUtil';

@Component({
  selector: 'app-host-management-page',

  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HostManagementCardComponent],
  templateUrl: './host-management.component.html',
})
export class HostManagementPageComponent implements OnInit {
  loggedInUser: LoggedInUserResDto | null = null;
  listing!: AirbnbListing;
  editingListing!: AirbnbListing;
  editingField: string = '';
  editForm: FormGroup;
  inputType: string = 'text';
  previewGalleryImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private navBarService: NavBarService,
    private activatedRoute: ActivatedRoute,
    private houseService: HouseService,
    private listingService: ListingService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService
  ) {
    this.editForm = this.fb.group({
      value: [''],
    });
  }
  ngOnInit(): void {
    this.navBarService.hideNavbar();
    let id = this.activatedRoute.snapshot.params['id'];
    let newId = parseInt(id);
    this.fetchAirBnbData(newId);
  }
  private fetchAirBnbData(id: number) {
    this.listingService
      .getListing(id)
      .pipe(
        map(({ data }) => {
          return modifyListing(data);
        })
      )
      .subscribe({
        next: (house) => {
          this.listing = house;
          this.previewGalleryImages = (
            this.listing?.images.gallery || []
          ).filter((img): img is string => typeof img === 'string');
        },
      });
  }
  onMainImageSelected = (event: Event, listing: AirbnbListing) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        listing.images.main = reader.result as string;

        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify({})], {
          type: 'application/json',
        });
        formData.append('partialListing', jsonBlob);
        formData.append('main', file);
        this.update(listing.id, formData);
      };
      reader.readAsDataURL(file);
    }
  };

  removeMainImage = (listing: AirbnbListing) => {
    listing.images.main = '';
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify({})], {
      type: 'application/json',
    });

    formData.append('partialListing', jsonBlob);
    formData.append('main', new File([], ''));
    this.update(listing.id, formData);
  };

  onGalleryImageSelected = (
    event: Event,
    listing: AirbnbListing,
    index: number
  ) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.previewGalleryImages[index] = reader.result as string;

        listing.images.gallery[index] = file;
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify({})], {
          type: 'application/json',
        });
        formData.append('partialListing', jsonBlob);
        for (let img of listing.images.gallery) {
          if (img instanceof File) {
            formData.append('gallery', img);
          } else {
            formData.append('gallery', base64ToFile(img, 'choosen'));
          }
        }

        this.update(listing.id, formData);
      };

      reader.readAsDataURL(file);
    }
  };

  removeGalleryImage = (listing: AirbnbListing, index: number) => {
    listing.images.gallery.splice(index, 1);
    this.previewGalleryImages.splice(index, 1);
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify({})], {
      type: 'application/json',
    });
    formData.append('partialListing', jsonBlob);
    listing.images.gallery.forEach((img) => {
      if (img instanceof File) {
        formData.append('gallery', img);
      } else if (typeof img === 'string' && img.startsWith('data:image/')) {
        const converted = base64ToFile(img, 'existing.png');
        if (converted.size > 0) {
          formData.append('gallery', converted);
        }
      }
    });
    this.update(listing.id, formData);
  };

  addGalleryImage = (listing: AirbnbListing) => {
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const previewUrl = reader.result as string;
          if (previewUrl) {
            this.previewGalleryImages.push(previewUrl);
            listing.images.gallery.push(file);

            const formData = new FormData();
            const jsonBlob = new Blob([JSON.stringify({})], {
              type: 'application/json',
            });
            formData.append('partialListing', jsonBlob);

            for (let img of listing.images.gallery) {
              if (img instanceof File) {
                formData.append('gallery', img);
              } else if (
                typeof img === 'string' &&
                img.startsWith('data:image/')
              ) {
                const converted = base64ToFile(img, 'existing.png');
                if (converted.size > 0) {
                  formData.append('gallery', converted);
                }
              }
            }

            this.update(listing.id, formData);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  openEditModal = (listing: AirbnbListing, field: string) => {
    this.editingListing = listing;
    this.editingField = field;
    const fieldValue = this.getFieldValue(listing, field);
    this.inputType = typeof fieldValue === 'number' ? 'number' : 'text';
    this.editForm.setValue({ value: fieldValue });
  };

  getFieldValue(listing: any, path: string) {
    return path.split('.').reduce((prev, curr) => prev?.[curr], listing);
  }

  setFieldValue(listing: any, path: string, value: any) {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const lastObj = keys.reduce((prev, curr) => prev[curr], listing);
    lastObj[lastKey] = value;
  }

  saveEdit() {
    if (this.editForm.valid && this.editingField) {
      this.setFieldValue(
        this.editingListing,
        this.editingField,
        this.editForm.value.value
      );

      let dataToSend: PartialListingUpdateDTO = {
        [this.removeFieldNesting()]: this.editForm.value.value,
      };
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(dataToSend)], {
        type: 'application/json',
      });
      formData.append('partialListing', jsonBlob);

      this.update(this.listing.id, formData);

      this.closeModal();
    }
  }

  closeModal() {
    this.editingField = '';
    this.editForm.reset();
  }

  deleteListing = (listing: AirbnbListing) => {
    if (confirm('You sure you want to delete the house')) {
      this.listingService.deleteListing(listing.id).subscribe({
        next: (res) => {
          if (res) this.router.navigate(['/']);
        },
        error: (err) => {
          handleError(err, this.toastService);
        },
      });
    }
  };

  private update = (id: number, formData: FormData) => {
    this.listingService.updateListing(id, formData).subscribe({
      next: (res) => {
        // update fav storage
        let data = res.data;
        this.updateStorage(id, {
          id: data.id,
          title: data.title,
          location: data.location,
          image: data.images.main,
          price: data.pricing.perNight,
        });
        sucessHandler(res, this.toastService);
      },
      error: (err) => {
        handleError(err, this.toastService);
      },
    });
  };

  private updateStorage = (id: number, favNew: FavCard) => {
    let favStorage = this.localStorageService.getStorage(FAV_KEY);
    if (favStorage) {
      let favourites = favStorage as FavCard[];
      favNew.image = `data:image/png;base64,${favNew.image}`;
      const updatedFavourites = favourites.map((fav) =>
        fav.id === id ? favNew : fav
      );

      this.localStorageService.setItem(FAV_KEY, updatedFavourites);
    }
  };

  private removeFieldNesting = () => {
    let field = '';

    if (this.editingField.includes('.')) {
      field = this.editingField.split('.')[1];
    } else {
      field = this.editingField;
    }
    return field;
  };
  goBackToHomePage() {
    this.router.navigate(['home']);
    this.navBarService.showNavbar();
  }
}
