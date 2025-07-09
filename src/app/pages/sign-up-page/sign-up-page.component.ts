import { Component, OnInit } from '@angular/core';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import { RegisterDto, SignUp } from '../../types';
import { NavBarService } from '../../services/navbar.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/http/user.service.http';
import { handleError } from '../../utils/errUtil';
import { sucessHandler } from '../../utils/sucessUtil';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [SignupFormComponent],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css',
})
export class SignUpPageComponent implements OnInit {
  constructor(
    private router: Router,
    private navBarService: NavBarService,
    private userService: UserService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.navBarService.hideNavbar();
  }

  signUpUser(sighupData: SignUp) {
    let registerInfo: RegisterDto = {
      name: sighupData.name,
      email: sighupData.email,
      password: sighupData.password,
      confirmPassword: sighupData.confirmPassword,
      joinedYear: new Date().getFullYear(),
    };
    this.userService.register(registerInfo).subscribe({
      next: (res) => {
        sucessHandler(res, this.toastService);
      },
      error: (err) => {
        handleError(err, this.toastService);
      },
    });
  }

  goToHomePage() {
    this.router.navigate(['/']);
    this.navBarService.showNavbar();
  }
}
