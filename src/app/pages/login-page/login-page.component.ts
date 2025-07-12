import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { Login } from '../../types';
import { NavBarService } from '../../services/navbar.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/http/user.service.http';
import { ToastService } from '../../services/toast.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { handleError } from '../../utils/errUtil';
import { sucessHandler } from '../../utils/sucessUtil';
import { environment } from '../../../environments/environment';
import { AUTH_KEY } from '../../constants/app.constant';
import { AuthUserService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit {
  constructor(
    private router: Router,
    private navBarService: NavBarService,
    private userService: UserService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private authService: AuthUserService
  ) {}
  ngOnInit(): void {
    this.navBarService.hideNavbar();
  }

  loginWithEmailAndPassword(data: Login) {
    this.userService.login(data).subscribe({
      next: (res) => {
        sucessHandler(res, this.toastService);
        this.localStorageService.setItem(AUTH_KEY, res.data);
        this.getUserDetails();
      },
      error: (err) => {
        handleError(err, this.toastService);
      },
    });
  }

  loginWithGithub() {
    window.location.href = environment.LOGIN_GITHUB;
  }

  loginWithGoogle() {
    window.location.href = environment.LOGIN_GOOGLE;
  }

  goToHomePage() {
    this.router.navigate(['/']);
    this.navBarService.showNavbar();
  }

  private getUserDetails = () => {
    this.userService.getAuthDetails().subscribe({
      next: (res) => {
        this.authService.setUser(res.data);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (err) => {
        handleError(err, this.toastService);
      },
    });
  };
}
