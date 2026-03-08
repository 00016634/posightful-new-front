import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts';
import { AnalyticsCardComponent, ConversionChartComponent } from '../../../shared/components';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  ButtonComponent,
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
} from '../../../shared/ui';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    PageLayoutComponent,
    AnalyticsCardComponent,
    ConversionChartComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    ButtonComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent,
  ],
  templateUrl: './manager-dashboard.component.html',

  styleUrl: './manager-dashboard.component.css',
})
export class ManagerDashboardComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);
  private authService = inject(AuthService);

  metrics = signal<any>(null);
  revenueTrend = signal<any>(null);
  personnelChart = signal<any>(null);
  conversionRateTrend = signal<any>(null);
  performanceChart = signal<any>(null);
  supervisorPerformance = signal<any[]>([]);

  avgRevenueLabels = signal<string[]>([]);
  avgRevenueDatasets = signal<any[]>([]);

  ngOnInit() {
    this.analyticsService.getManagerMetrics().subscribe(data => this.metrics.set(data));
    this.analyticsService.getRevenueTrend().subscribe(data => this.revenueTrend.set(data));
    this.analyticsService.getPersonnelChart().subscribe(data => {
      this.personnelChart.set(data);
      // Compute avg revenue per agent from revenue trend and personnel
      if (data && this.revenueTrend()) {
        const rev = this.revenueTrend()!;
        const agents = data.datasets[0].data;
        const avgData = rev.datasets[0].data.map((r: number, i: number) =>
          Math.round(r / (agents[i] || 1))
        );
        this.avgRevenueLabels.set(rev.labels);
        this.avgRevenueDatasets.set([
          { name: 'Avg Revenue/Agent', data: avgData, color: '#f59e0b' },
        ]);
      }
    });
    this.analyticsService.getConversionRateTrend().subscribe(data => this.conversionRateTrend.set(data));
    this.analyticsService.getPerformanceChart().subscribe(data => this.performanceChart.set(data));
    this.analyticsService.getSupervisorPerformance().subscribe(data => this.supervisorPerformance.set(data));
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
