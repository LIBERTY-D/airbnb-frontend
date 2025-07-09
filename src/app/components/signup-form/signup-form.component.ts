import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserValidator } from '../../validators';
import { SignUp } from '../../types';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css',
})
export class SignupFormComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  @Output() formData: EventEmitter<SignUp> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: UserValidator.passwordMatchValidator }
    );
  }

  get f() {
    return this.signupForm.controls;
  }

  signup() {
    this.submitted = true;
    if (this.signupForm.invalid) return;
    this.formData.emit(this.signupForm.value);
  }
}
