import { Component, OnInit } from '@angular/core';
import { AirBnbCardComponent } from '../../components/air-bnb-card/air-bnb-card.component';
import { CommonModule } from '@angular/common';

import { AirbnbListing } from '../../types/air-bnb-details-card.type';
import { SwipeRightDirective } from '../../directives/swipe-right.directive';
import { Router } from '@angular/router';
import { NavBarService } from '../../services/navbar.service';
import { FavouritesService } from '../../services/favourites.service';
import { FavCard, LoggedInUserResDto } from '../../types';
import { HouseService } from '../../services/houses.service';
import { AuthUserService } from '../../services/auth.service';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    AirBnbCardComponent,
    CommonModule,
    SwipeRightDirective,
    LoaderComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  houses: AirbnbListing[] = [];
  isLoading!: boolean;
  loggedInUser: LoggedInUserResDto | null = null;
  constructor(
    private router: Router,
    private navBarService: NavBarService,
    private favouritesService: FavouritesService,
    private houseService: HouseService,
    private authUserService: AuthUserService
  ) {
    this.navBarService.showNavbar();
    this.houseService.init();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.navBarService.showNavbar();
    this.houseService.houseObserver$.subscribe({
      next: (houses) => {
        this.houses = houses;
        this.isLoading = false;
      },
    });

    this.authUserService.user$.subscribe({
      next: (user) => {
        this.loggedInUser = user;
      },
    });
  }
  gotToDetailsPageBySwipe(data: AirbnbListing) {
    this.router.navigate(['details', 'detail', 0]);
    this.navBarService.hideNavbar();
  }

  gotToDetailsPageByClick(data: AirbnbListing) {
    this.router.navigate(['details', 'detail', data.id]);
    this.navBarService.hideNavbar();
  }

  clickFavouritesIcon(house: AirbnbListing) {
    let fav: FavCard = {
      id: house.id,
      title: house.title,
      location: { city: house.location.city, country: house.location.country },
      image: house.images.main,
      price: house.pricing.perNight,
    };
    this.favouritesService.updateFavourites(fav);
  }

  goToHostPage(arg: AirbnbListing) {
    this.router.navigate(['host-management', arg.id]);
  }
}
