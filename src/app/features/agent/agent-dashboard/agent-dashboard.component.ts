import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import { PageHeaderComponent } from '../../../shared/layouts/page-header.component';
import { AnalyticsCardComponent } from '../../../shared/components/analytics-card.component';
import { DashboardFiltersComponent } from '../../../shared/components/dashboard-filters.component';
import { ConversionChartComponent } from '../../../shared/components/conversion-chart.component';
import { BonusesCardComponent } from '../../../shared/components/bonuses-card.component';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../shared/ui/card.component';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [
    PageLayoutComponent,
    PageHeaderComponent,
    AnalyticsCardComponent,
    DashboardFiltersComponent,
    ConversionChartComponent,
    BonusesCardComponent,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
  ],
  templateUrl: './agent-dashboard.component.html',

  styleUrl: './agent-dashboard.component.css',
})
export class AgentDashboardComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);

  timeRange = signal('this_month');

  metrics = signal({
    leadsByDay: { value: 0, trend: '' },
    leadsConverted: { value: 0, trend: '' },
    salesByDay: { value: 0, trend: '' },
    pendingLeads: { value: 0, trend: '' },
  });

  chartData = signal<{ labels: string[]; datasets: { name: string; data: number[]; color?: string }[] }>({
    labels: [],
    datasets: [],
  });

  ngOnInit() {
    this.analyticsService.getAgentMetrics().subscribe(data => {
      this.metrics.set(data);
    });

    this.analyticsService.getConversionChart().subscribe(data => {
      this.chartData.set(data);
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
