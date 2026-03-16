import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent, AvatarComponent, BadgeComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent,
  TableRowComponent, TableHeadComponent, TableCellComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../shared/ui/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { BonusService } from '../../../core/services/bonus.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accountant-dashboard',
  standalone: true,
  imports: [
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, LabelComponent, AvatarComponent, BadgeComponent,
    TableComponent, TableHeaderComponent, TableBodyComponent,
    TableRowComponent, TableHeadComponent, TableCellComponent,
  ],
  templateUrl: './accountant-dashboard.component.html',
  styleUrl: './accountant-dashboard.component.css',
})
export class AccountantDashboardComponent implements OnInit {
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private bonusService = inject(BonusService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  Math = Math;
  selectedYear = signal(new Date().getFullYear().toString());
  selectedMonth = signal(String(new Date().getMonth() + 1).padStart(2, '0'));
  showData = signal(false);
  months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
    { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];
  bonusSummary = signal<any[]>([]);
  bonusDetails = signal<any[]>([]);
  totalBonus = computed(() => this.bonusSummary().reduce((s, a) => s + (a.totalBonus || 0), 0));
  totalConversions = computed(() => this.bonusSummary().reduce((s, a) => s + (a.conversions || 0), 0));
  totalSales = computed(() => this.bonusSummary().reduce((s, a) => s + (a.totalSales || 0), 0));

  ngOnInit() {}

  generate() {
    const month = `${this.selectedYear()}-${this.selectedMonth()}`;
    this.bonusService.getMonthlyDetail(month).subscribe(data => {
      this.bonusSummary.set(data.map((d: any) => ({
        agentName: d.agentName || '',
        agentCode: d.agentCode || '',
        totalBonus: d.bonusAmount || 0,
        conversions: d.conversions || 0,
        totalSales: d.totalSales || 0,
      })));
      this.bonusDetails.set(data.map((d: any, i: number) => ({
        id: String(i + 1),
        agentName: d.agentName || '',
        agentCode: d.agentCode || '',
        leadId: '-',
        customerName: '-',
        saleAmount: d.totalSales || 0,
        saleDate: `${this.getMonthLabel()} ${this.selectedYear()}`,
        ruleName: 'Aggregated',
        ruleType: 'Monthly total',
        bonusAmount: d.bonusAmount || 0,
        calculation: `${d.conversions || 0} conversions`,
      })));
      this.showData.set(true);
      this.toastService.show('Reports Generated', 'Bonus reports generated successfully');
    });
  }
  exportCSV(type: string) { this.toastService.show('Exported', `${type === 'summary' ? 'Summary' : 'Audit details'} exported to CSV`); }
  getMonthLabel(): string { return this.months.find(m => m.value === this.selectedMonth())?.label || ''; }
  initials(name: string): string { if (!name) return '?'; return name.split(' ').map(n => n[0]).join(''); }
  fmt(value: number): string { return (value || 0).toLocaleString(); }
}
