import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookingCardComponent } from '../../components/booking-card/booking-card.component';
import { BookingResponseDTO, LoggedInUserResDto } from '../../types';
import { NavBarService } from '../../services/navbar.service';
import { RouterLink } from '@angular/router';
import { AuthUserService } from '../../services/auth.service';

@Component({
  selector: 'app-bookings-page',
  standalone: true,
  imports: [CommonModule, BookingCardComponent, RouterLink],
  templateUrl: './bookings-page.component.html',
  styleUrl: './bookings-page.component.css',
})
export class BookingsPageComponent implements OnInit {
  bookings: BookingResponseDTO[] = [];
  loggedInUser: LoggedInUserResDto | null = null;
  constructor(
    private navBarService: NavBarService,
    private authUserService: AuthUserService
  ) {}

  ngOnInit(): void {
    this.navBarService.hideNavbar();
    this.authUserService.user$.subscribe({
      next: (user) => {
        this.loggedInUser = user;
        if (user?.bookings) {
          user.bookings.map((booking) => {
            if (booking.mainImage) {
              booking.mainImage = `data:image/png;base64,${booking.mainImage}`;
            }
            return booking;
          });
          this.bookings = user?.bookings as BookingResponseDTO[];
        }
      },
    });
  }
}
