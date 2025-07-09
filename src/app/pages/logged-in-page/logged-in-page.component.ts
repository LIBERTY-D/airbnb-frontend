import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../services/localStorage.service';
import { AUTH_KEY } from '../../constants/app.constant';
import { NavBarService } from '../../services/navbar.service';
import { UserService } from '../../services/http/user.service.http';
import { AuthUserService } from '../../services/auth.service';
import { handleError } from '../../utils/errUtil';
import { ToastService } from '../../services/toast.service';
import { FooterService } from '../../services/footer.service';

@Component({
  selector: 'app-logged-in-page',
  standalone: true,
  imports: [],
  templateUrl: './logged-in-page.component.html',
  styleUrl: './logged-in-page.component.css',
})
export class LoggedInPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private navBarService: NavBarService,
    private userService: UserService,
    private authService: AuthUserService,
    private toastService: ToastService,
    private footerService: FooterService
  ) {}

  ngOnInit(): void {
    this.navBarService.hideNavbar();
    this.footerService.hideFooter();
    this.route.queryParams.subscribe((params) => {
      const accessToken = params['access_token'];
      const refreshToken = params['refresh_token'];

      if (accessToken && refreshToken) {
        this.localStorageService.setItem(AUTH_KEY, {
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        this.getUserDetails();
      } else {
        // Invalid tokens or something went wrong
        this.router.navigate(['/login']);
        this.footerService.showFooter();
      }
    });
  }

  private getUserDetails = () => {
    this.userService.getAuthDetails().subscribe({
      next: (res) => {
        this.authService.setUser(res.data);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        handleError(err, this.toastService);
      },
    });
  };
}
