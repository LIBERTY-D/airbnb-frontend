import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarService } from '../../services/navbar.service';
import { FavouritesCardComponent } from '../../components/favourites-card/favourites-card.component';
import { FavCard } from '../../types';
import { FavouritesService } from '../../services/favourites.service';

@Component({
  selector: 'app-favourite-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FavouritesCardComponent],
  templateUrl: './favourite-page.component.html',
  styleUrl: './favourite-page.component.css',
})
export class FavoritesPageComponent implements OnInit {
  favorites: FavCard[] = [];
  constructor(
    private navBarService: NavBarService,
    private favouritesService: FavouritesService
  ) {}

  ngOnInit(): void {
    this.navBarService.hideNavbar();

    this.favouritesService.favObserver$.subscribe({
      next: (liked) => {
        this.favorites = liked;
      },
    });
  }

  removeFromFavorites = (id: number) => {
    this.favouritesService.removeFromFavourites(id);
  };
}
