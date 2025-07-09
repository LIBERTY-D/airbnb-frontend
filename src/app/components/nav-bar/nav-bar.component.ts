import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarLinkComponent } from '../navbar-link/navbar-link.component';
import { Router } from '@angular/router';
import { NavBarService } from '../../services/navbar.service';
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { SearchNavBarService } from '../../services/searchNav.service';
import { HouseService } from '../../services/houses.service';
import { parseDateRange } from '../../utils/dateUtil';
import { NavabrQuery } from '../../types/navbar.type';
import { LoggedInUserResDto } from '../../types';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarLinkComponent, FlatpickrDirective],
  providers: [
    provideFlatpickrDefaults({
      dateFormat: 'Y-m-d',
      altInput: true,
      mode: 'range',
    }),
  ],

  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  @Input() goToAccountPage!: () => void;
  @Input() loggedInUser: LoggedInUserResDto | null = null;
  mobileMenuOpen = false;

  filters = {
    location: '',
    dateRange: '',
    guests: 1,
  };
  links: string[] = [
    'Home',
    'bookings',
    'favourites',
    'Create Listing',
    'Start Hosting',
    'My Listings',
    'About',
    'Contact',
    'Login',
    'Sign Up',
  ];
  constructor(
    private router: Router,
    private navBarService: NavBarService,
    private houseService: HouseService
  ) {}

  searchListings() {
    let { start, end } = parseDateRange(this.filters.dateRange);
    let query: NavabrQuery = {
      location: this.filters.location,
      quests: this.filters.guests,
      date: [start, end],
    };
    this.houseService.updateHousesBasedOnQuery(query);
  }

  clearFilters() {
    this.filters = {
      location: '',
      dateRange: '',
      guests: 1,
    };

    this.houseService.init(); // Reset to all listings
  }
  goToPage = (link: string) => {
    switch (link) {
      case 'Home':
        this.go(['home']);
        break;
      case 'bookings':
        this.go(['bookings']);
        break;
      case 'favourites':
        this.go(['favourites']);
        break;

      case 'Create Listing':
        this.go(['create-listing']);
        break;
      case 'My Listings':
        this.go(['my-listings']);

        break;
      case 'Start Hosting':
        this.go(['become-host']);

        break;
      case 'About':
        this.go(['about']);
        break;
      case 'Contact':
        this.go(['contact']);

        break;
      case 'Login':
        this.go(['login']);
        break;
      case 'Sign Up':
        this.go(['signup']);
        break;
      default:
        console.warn('Unknown link:', link);
        break;
    }
  };
  hasRole(role: string): boolean {
    const user = this.loggedInUser;
    if (user) user?.roles?.includes(role);
    return false;
  }
  shouldShowLink(link: string): boolean {
    const hostOnlyLinks = ['Create Listing', 'My Listings'];
    const authLinks = ['Login', 'Sign Up'];
    const general = ['bookings'];

    const isHostLink = hostOnlyLinks.includes(link);
    const isAuthLink = authLinks.includes(link);
    const isGeneral = general.includes(link);
    if (
      isHostLink &&
      !this.loggedInUser?.roles?.includes('ROLE_HOST') &&
      !this.loggedInUser?.roles?.includes('ROLE_ADMIN')
    ) {
      return false;
    }

    if (isAuthLink && this.loggedInUser) {
      return false;
    }
    if (isGeneral && !this.loggedInUser) {
      return false;
    }

    return true;
  }

  private go = (navs: string[]) => {
    if (!navs.includes('home')) {
      this.navBarService.hideNavbar();
    } else {
      this.navBarService.showNavbar();
    }
    this.router.navigate(navs);
  };
}
