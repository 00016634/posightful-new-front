import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() backRoute = '';
  @Input() className = '';
  @Input() showLogout = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goBack() {
    this.router.navigateByUrl(this.backRoute);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
