import { Component, OnInit } from '@angular/core';
import { AirBnbDetailsCardComponent } from '../../components/air-bnb-details-card/air-bnb-details-card.component';
import { AirbnbListing, CreateBookingDTO } from '../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { NavBarService } from '../../services/navbar.service';
import { HouseService } from '../../services/houses.service';
import { BookingsService } from '../../services/http/booking.service.http';
import { ToastService } from '../../services/toast.service';
import { handleError } from '../../utils/errUtil';
import { UserService } from '../../services/http/user.service.http';
import { AuthUserService } from '../../services/auth.service';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [AirBnbDetailsCardComponent],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css',
})
export class DetailsPageComponent implements OnInit {
  airBnbHouse: AirbnbListing | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navBarService: NavBarService,
    private houseService: HouseService,
    private bookingsService: BookingsService,
    private toastService: ToastService,
    private userService: UserService,
    private authUserService: AuthUserService
  ) {}

  ngOnInit(): void {
    this.navBarService.hideNavbar();
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('airbnbId');
      if (id) {
        this.fetchAirBnbData(+id);
      }
    });
  }
  BookHouse(createBookingDTO: CreateBookingDTO) {
    this.bookingsService.createBooking(createBookingDTO).subscribe({
      next: (res) => {
        if (res.message && res.message.startsWith('successfully booked')) {
          this.toastService.show('booked the house sucessfully', 'success');
          this.fetchAccount();
        }
      },
      error: (err) => {
        handleError(err, this.toastService);
      },
    });
  }

  private fetchAirBnbData(id: number) {
    this.houseService.houseObserver$.subscribe({
      next: (houses) => {
        this.airBnbHouse = houses.filter((house) => house.id == id)[0];
      },
    });
  }

  goToHomePage() {
    this.router.navigate(['/']);
    this.navBarService.showNavbar();
  }
  fetchAccount() {
    this.userService.getAuthDetails().subscribe({
      next: (res) => {
        if (res.message.startsWith('authenticated user')) {
          this.authUserService.setUser(res.data);
          this.authUserService.setUser(res.data);
        }
      },
    });
  }
}
