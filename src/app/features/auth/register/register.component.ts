import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^(\+998|998)\d{9}$/)]],
      full_name: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required]],
    });
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get phone_number() { return this.registerForm.get('phone_number'); }
  get password() { return this.registerForm.get('password'); }
  get password2() { return this.registerForm.get('password2'); }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { password, password2 } = this.registerForm.value;
    if (password !== password2) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.registerForm.value).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.success = 'Account created! Redirecting...';
        setTimeout(() => this.router.navigate(['/']), 500);
      },
      error: (err) => {
        if (err.status === 0) {
          this.error = 'Cannot connect to server. Please check if the backend is running.';
          return;
        }

        const errors = err.error;
        if (typeof errors === 'object' && errors !== null) {
          const messages = Object.entries(errors)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join('; ');
          this.error = messages;
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      },
    });
  }
}
