import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavBarService } from '../../services/navbar.service';
import { CommonModule } from '@angular/common';
import { BecomeHostService } from '../../services/http/become-host.service.http';
import { ToastService } from '../../services/toast.service';
import { RouterLink } from '@angular/router';
import { LoggedInUserResDto } from '../../types';
import { AuthUserService } from '../../services/auth.service';
import { UserService } from '../../services/http/user.service.http';

@Component({
  selector: 'app-become-host',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './become-host.component.html',
})
export class BecomeHostComponent implements OnInit {
  loggedInUser: LoggedInUserResDto | null = null;
  constructor(
    private navBarService: NavBarService,
    private becomeHostService: BecomeHostService,
    private toastService: ToastService,
    private authUserService: AuthUserService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.navBarService.hideNavbar();
    this.authUserService.user$.subscribe({
      next: (user) => {
        this.loggedInUser = user;
      },
    });
  }
  hostEmail: string = '';
  emailSubmitted: boolean = false;
  message: string = '';

  submitHostEmail() {
    if (!this.hostEmail) return;
    this.becomeHostService.becomeHost({ email: this.hostEmail }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.emailSubmitted = true;
        setTimeout(() => {
          this.hostEmail = '';
          this.fetchAccount();
        }, 3000);
      },
      error: (error) => {
        if (
          error.status == 400 &&
          error.error.message.includes(
            'please create account or make sure you are verified to become host'
          )
        ) {
          this.toastService.show(error.error.message, 'error');
        } else if (error.error?.errors && error.error?.errors?.email) {
          this.toastService.show(error.error.errors.email, 'error');
        } else {
          this.toastService.show(error.message, 'error');
        }
      },
    });
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
