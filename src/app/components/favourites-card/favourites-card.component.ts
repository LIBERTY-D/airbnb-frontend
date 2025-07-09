import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavCard } from '../../types';

@Component({
  selector: 'app-favourites-card',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './favourites-card.component.html',
  styleUrl: './favourites-card.component.css'
})
export class FavouritesCardComponent {

  @Input() fav!:FavCard
  @Input () removeFromFavorites!:(id:number)=>void
}
