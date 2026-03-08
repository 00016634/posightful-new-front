import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent,
} from '../../../shared/ui';
import { UserManagementService } from '../../../core/services/user-management.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent,
  ],
  templateUrl: './admin-dashboard.component.html',

  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  router = inject(Router);
  private userService = inject(UserManagementService);
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  stats = signal({ tenantName: '—', totalUsers: 0, activeUsers: 0, totalProducts: 0 });
  recentActivity = signal<{ action: string; detail: string; time: string; timestamp: string }[]>([]);

  ngOnInit() {
    this.userService.getAdminStats().subscribe({
      next: (data) => this.stats.set(data),
    });
    this.userService.getRecentActivity().subscribe({
      next: (data) => this.recentActivity.set(data),
    });
  }
}
