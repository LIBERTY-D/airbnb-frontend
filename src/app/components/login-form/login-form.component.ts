import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Login } from '../../types';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  @Output() formData: EventEmitter<Login> = new EventEmitter<Login>();
  @Output() github: EventEmitter<string> = new EventEmitter();
  @Output() google: EventEmitter<string> = new EventEmitter();
  loginForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this.formData.emit({ email, password });
  }

  get f() {
    return this.loginForm.controls;
  }
  signInWithGoogle() {
    this.google.emit();
  }

  signInWithGitHub() {
    this.github.emit();
  }
}
