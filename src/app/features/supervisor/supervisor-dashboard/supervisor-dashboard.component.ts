import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { PageLayoutComponent, PageHeaderComponent } from '../../../shared/layouts';
import { AnalyticsCardComponent, ConversionChartComponent } from '../../../shared/components';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../shared/ui';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-supervisor-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    PageLayoutComponent,
    PageHeaderComponent,
    AnalyticsCardComponent,
    ConversionChartComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
  ],
  templateUrl: './supervisor-dashboard.component.html',

  styleUrl: './supervisor-dashboard.component.css',
})
export class SupervisorDashboardComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  router = inject(Router);

  metrics = signal({
    activeAgents: { value: '', trend: '' },
    avgLeadsPerAgent: { value: '', trend: '' },
    avgTicket: { value: '', trend: '' },
    conversionRate: { value: '', trend: '' },
    totalRevenue: { value: '', trend: '' },
  });

  performanceChart = signal<{ labels: string[]; datasets: { name: string; data: number[]; color?: string }[] } | null>(null);
  topAgents = signal<{ name: string; code: string; leads: number; conversions: number; revenue: number }[]>([]);

  ngOnInit() {
    this.analyticsService.getSupervisorMetrics().subscribe(data => this.metrics.set(data));
    this.analyticsService.getPerformanceChart().subscribe(data => this.performanceChart.set(data));
    this.analyticsService.getTopAgents().subscribe(data => this.topAgents.set(data));
  }
}
