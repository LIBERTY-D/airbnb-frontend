import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarService } from '../../services/navbar.service';
import { ContactService } from '../../services/http/contact.service.http';
import { Contact } from '../../types';
import { ToastService } from '../../services/toast.service';
import { sucessHandler } from '../../utils/sucessUtil';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css',
})
export class ContactPageComponent implements OnInit {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private navBarService: NavBarService,
    private contactService: ContactService,
    private toastService: ToastService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  submitForm() {
    if (this.contactForm.valid) {
      let contact: Contact = {
        fullName: this.contactForm.get('name')?.value,
        email: this.contactForm.get('email')?.value,
        message: this.contactForm.get('message')?.value,
      };
      this.contactService.contactUs(contact).subscribe({
        next: (res) => {
          sucessHandler(res, this.toastService);
          this.contactForm.reset();
        },
        error: (err) => {
          this.toastService.show(
            'the was an error sending the message',
            'error'
          );
        },
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  goToHomePage() {
    this.router.navigate(['/']);
    this.navBarService.showNavbar();
  }
  ngOnInit(): void {
    this.navBarService.hideNavbar();
  }
}
