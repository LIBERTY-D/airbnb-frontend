import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AirbnbListing, LoggedInUserResDto } from '../../types';
import { NavBarService } from '../../services/navbar.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '../../services/auth.service';
import { MyListingCardComponent } from '../../components/my-listing-card/my-listing-card.component';

@Component({
  selector: 'app-my-listing-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MyListingCardComponent],
  templateUrl: './my-listing-page.component.html',
})
export class MyListingPageComponent implements OnInit {
  loggedInUser: LoggedInUserResDto | null = null;
  listings: AirbnbListing[] = [];

  constructor(
    private router: Router,
    private navBarService: NavBarService,
    private AuthUserService: AuthUserService
  ) {}
  ngOnInit(): void {
    this.navBarService.hideNavbar();

    this.AuthUserService.user$.subscribe({
      next: (user) => {
        this.loggedInUser = user;

        this.listings = (user?.listings || []).map((listing) => {
          listing.images.main = `data:image/png;base64,${listing.images.main}`;
          listing.images.gallery = listing.images.gallery.map((img) => {
            img = `data:image/png;base64,${img}`;
            return img;
          });

          return listing;
        });
      },
    });
  }

  goBackToHomePage() {
    this.router.navigate(['home']);
    this.navBarService.showNavbar();
  }
  goToCreateListingPage() {
    this.router.navigate(['create-listing']);
    this.navBarService.showNavbar();
  }
}
