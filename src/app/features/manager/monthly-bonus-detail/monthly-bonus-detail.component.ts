import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, AvatarComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent,
  TableRowComponent, TableHeadComponent, TableCellComponent,
} from '../../../shared/ui';
import { BonusService } from '../../../core/services/bonus.service';

@Component({
  selector: 'app-monthly-bonus-detail',
  standalone: true,
  imports: [
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, AvatarComponent,
    TableComponent, TableHeaderComponent, TableBodyComponent,
    TableRowComponent, TableHeadComponent, TableCellComponent,
  ],
  templateUrl: './monthly-bonus-detail.component.html',

  styleUrl: './monthly-bonus-detail.component.css',
})
export class MonthlyBonusDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private bonusService = inject(BonusService);

  month = '';
  agents = signal<any[]>([]);
  Math = Math;

  totalConversions = computed(() => this.agents().reduce((sum, a) => sum + a.conversions, 0));
  totalSales = computed(() => this.agents().reduce((sum, a) => sum + a.totalSales, 0));
  totalBonuses = computed(() => this.agents().reduce((sum, a) => sum + a.bonusAmount, 0));

  ngOnInit() {
    this.month = this.route.snapshot.paramMap.get('month') || '';
    this.bonusService.getMonthlyDetail(this.month).subscribe(data => this.agents.set(data));
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}
