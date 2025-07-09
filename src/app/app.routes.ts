import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { CreateListingPageComponent } from './pages/create-listing-page/create-listing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { DetailsPageComponent } from './pages/details-page/details-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { BookingsPageComponent } from './pages/bookings-page/bookings-page.component';
import { FavoritesPageComponent } from './pages/favourite-page/favourite-page.component';
import { HostManagementPageComponent } from './pages/host-management-page/host-management.component';
import { MyListingPageComponent } from './pages/my-listing-page/my-listing-page.component';
import { BecomeHostComponent } from './pages/become-host-page/become-host.component';
import { LoggedInPageComponent } from './pages/logged-in-page/logged-in-page.component';
import { preventEnteringPage } from './gaurds/no-auth.gaurd';
import { authGaurd } from './gaurds/auth.gaurd';
import { authHostGaurd } from './gaurds/auth-host.gaurd';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [preventEnteringPage],
  },
  {
    path: 'signup',
    component: SignUpPageComponent,
    canActivate: [preventEnteringPage],
  },
  {
    path: 'contact',
    component: ContactPageComponent,
  },
  {
    path: 'about',
    component: AboutPageComponent,
  },
  {
    path: 'become-host',
    component: BecomeHostComponent,
    canActivate: [authGaurd],
  },
  {
    path: 'host-management/:id',
    component: HostManagementPageComponent,
    canActivate: [authGaurd],
  },
  {
    path: 'create-listing',
    component: CreateListingPageComponent,
    canActivate: [authGaurd, authHostGaurd],
  },
  {
    path: 'details/detail/:airbnbId',
    component: DetailsPageComponent,
  },
  {
    path: 'account',
    component: AccountPageComponent,
    canActivate: [authGaurd],
  },
  {
    path: 'bookings',
    component: BookingsPageComponent,
    canActivate: [authGaurd],
  },
  {
    path: 'favourites',
    component: FavoritesPageComponent,
  },
  {
    path: 'my-listings',
    component: MyListingPageComponent,
    canActivate: [authGaurd, authHostGaurd],
  },
  {
    path: 'logged-in',
    component: LoggedInPageComponent,
  },

  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
