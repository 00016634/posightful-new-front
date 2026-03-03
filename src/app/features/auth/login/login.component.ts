import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.login(this.loginForm.value).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.success = 'Login successful! Redirecting...';

        const user = this.authService.currentUserValue;
        const role = user?.roles?.[0]?.code || user?.roles?.[0]?.name;

        setTimeout(() => {
          switch (role) {
            case 'AGENT': this.router.navigate(['/agent']); break;
            case 'SUPERVISOR': this.router.navigate(['/supervisor']); break;
            case 'MANAGER': this.router.navigate(['/manager']); break;
            case 'ACCOUNTANT':
            case 'FINANCE': this.router.navigate(['/accountant']); break;
            case 'ADMIN': this.router.navigate(['/admin']); break;
            default: this.router.navigate(['/']); break;
          }
        }, 500);
      },
      error: (err) => {
        if (err.status === 0) {
          this.error = 'Cannot connect to server. Please check if the backend is running.';
          return;
        }

        const body = err.error;
        if (typeof body === 'string') {
          this.error = body;
        } else if (body) {
          this.error =
            body.detail ||
            body.message ||
            body.non_field_errors?.[0] ||
            body.username?.[0] ||
            body.password?.[0] ||
            'Invalid username or password.';
        } else {
          this.error = 'Invalid username or password.';
        }
      },
    });
  }
}
