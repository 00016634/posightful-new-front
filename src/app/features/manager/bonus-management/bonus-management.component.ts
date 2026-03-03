import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import { ConversionChartComponent } from '../../../shared/components/conversion-chart.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent,
} from '../../../shared/ui';
import { BonusService } from '../../../core/services/bonus.service';

@Component({
  selector: 'app-bonus-management',
  standalone: true,
  imports: [
    PageLayoutComponent, ConversionChartComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent,
  ],
  templateUrl: './bonus-management.component.html',

  styleUrl: './bonus-management.component.css',
})
export class BonusManagementComponent implements OnInit {
  router = inject(Router);
  private bonusService = inject(BonusService);

  monthlyBonuses = signal<any[]>([]);
  currentMonth = signal<any>(null);
  chartLabels = signal<string[]>([]);
  chartDatasets = signal<any[]>([]);

  ngOnInit() {
    this.bonusService.getMonthlyBonuses().subscribe(data => {
      this.monthlyBonuses.set(data);
      if (data.length > 0) {
        this.currentMonth.set(data[0]);
        this.chartLabels.set(data.slice().reverse().map((d: any) => d.month));
        this.chartDatasets.set([
          { name: 'Bonus Amount', data: data.slice().reverse().map((d: any) => d.totalBonus), color: '#10b981' },
        ]);
      }
    });
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}
