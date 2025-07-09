import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoggedInUserResDto, UpdateUserDto, User } from '../../types';
import { NavBarService } from '../../services/navbar.service';
import { AuthUserService } from '../../services/auth.service';
import { handleError } from '../../utils/errUtil';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/http/user.service.http';
import { sucessHandler } from '../../utils/sucessUtil';
import { LocalStorageService } from '../../services/localStorage.service';
import { AUTH_KEY } from '../../constants/app.constant';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-page.component.html',
})
export class AccountPageComponent implements OnInit {
  user: LoggedInUserResDto | null = null;
  editingField: keyof LoggedInUserResDto | null = null;
  editForm: FormGroup;
  confirmingDelete = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private navBarService: NavBarService,
    private authUserService: AuthUserService,
    private toastService: ToastService,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {
    this.editForm = this.fb.group(
      {
        value: ['', Validators.required],
        confirmPassword: [''], // Only used for password update
      },
      {
        validators: this.matchPasswordsValidator(),
      }
    );
  }
  ngOnInit(): void {
    this.navBarService.hideNavbar();
    this.authUserService.user$.subscribe({
      next: (authenticatedUser) => {
        this.user = authenticatedUser;
      },
      error: (err) => {
        handleError(err, this.toastService);
      },
    });
  }

  openEditModal(field: string) {
    this.editingField = field as keyof LoggedInUserResDto;

    if (field === 'password') {
      this.editForm = this.fb.group(
        {
          value: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
        },
        {
          validators: this.matchPasswordsValidator(),
        }
      );
    } else {
      this.editForm = this.fb.group({
        value: ['', Validators.required],
      });
    }

    if (this.user && field !== 'password') {
      const initial = this.user[field as keyof typeof this.user];
      this.editForm.patchValue({ value: initial });
    }
  }

  closeModal() {
    this.editingField = null;
    this.editForm.reset();
  }

  updateUserField<K extends keyof LoggedInUserResDto>(
    user: LoggedInUserResDto,
    key: K,
    value: LoggedInUserResDto[K]
  ) {
    user[key] = value;
  }

  saveEdit() {
    if (this.editForm.valid && this.editingField !== null) {
      const value = this.editForm.value.value;

      if (this.editingField === 'password') {
        // Sending a separate password update request
        this.userService.updateUser({ password: value }).subscribe({
          next: (res) => {
            sucessHandler(res, this.toastService);
            this.closeModal();
          },
          error: (err) => handleError(err, this.toastService),
        });
        return;
      }

      // Otherwise, update general user fields
      if (this.user) {
        this.updateUserField(this.user, this.editingField, value);
        const newUpdate: UpdateUserDto = {
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone || '',
          joinedYear: this.user.joinedYear,
          superhost: this.user.superhost,
        };
        this.userService.updateUser(newUpdate).subscribe({
          next: (res) => {
            sucessHandler(res, this.toastService);
            this.authUserService.setUser(res.data);
          },
          error: (err) => handleError(err, this.toastService),
        });
      }

      this.closeModal();
    }
  }

  deleteAccount() {
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.toastService.show('Account deleted successfully', 'success');
        this.confirmingDelete = false;
        this.localStorageService.clearStorage(AUTH_KEY);
        this.authUserService.clearUser();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toastService.show('Failed to delete account', 'error');
      },
    });
  }
  private matchPasswordsValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('value')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;

      if (this.editingField === 'password' && password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }
  logout() {
    this.localStorageService.clearStorage(AUTH_KEY);
    window.location.assign('/');
  }
  goBackHome() {
    this.router.navigate(['/']);
    this.navBarService.showNavbar();
  }
}
