import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarService } from './services/navbar.service';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { LoggedInUserResDto } from './types';
import { AuthUserService } from './services/auth.service';
import { FooterService } from './services/footer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavBarComponent,
    FooterComponent,
    CommonModule,
    ToastComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'airbnb';
  show: boolean = true;
  loggedInUser: LoggedInUserResDto | null = null;
  showFooter: boolean = true;
  constructor(
    private navBarService: NavBarService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authUserService: AuthUserService,
    private footerService: FooterService
  ) {}
  ngAfterViewInit(): void {
    this.getLoggedInUser();

    this.navBarService.navbarObserver$.subscribe({
      next: (isNav) => {
        this.show = isNav;
        this.cdr.detectChanges();
      },
    });

    this.footerService.footerObserver$.subscribe({
      next: (isFooter) => {
        this.showFooter = isFooter;
        this.cdr.detectChanges();
      },
    });
  }
  goToAccountPage() {
    this.router.navigate(['account']);
  }

  getLoggedInUser() {
    this.authUserService.user$.subscribe({
      next: (res) => {
        this.loggedInUser = res;
      },
    });
  }
}
